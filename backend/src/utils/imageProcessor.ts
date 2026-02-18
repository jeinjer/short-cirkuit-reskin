import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'products');
const SUPPORTED_URL_PROTOCOLS = ['http:', 'https:'];
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'products';

const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const sanitizeSku = (sku: string) => sku.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 40) || 'product';

const ensureUploadsDir = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};

const isAlreadyLocalUpload = (input: string) => input.includes('/uploads/products/');
const isCloudinaryUrl = (input: string) => input.includes('res.cloudinary.com');

const isDataUrl = (input: string) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(input);

const isRemoteUrl = (input: string) => {
  try {
    const parsed = new URL(input);
    return SUPPORTED_URL_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
};

type WhiteRemovalLevel = 'low' | 'medium' | 'high';

const getLevelConfig = (level: WhiteRemovalLevel) => {
  if (level === 'low') {
    return { bgMinBrightness: 252, bgMaxSaturation: 8, featherMinBrightness: 248, featherMaxSaturation: 12, featherAlpha: 210 };
  }
  if (level === 'high') {
    return { bgMinBrightness: 222, bgMaxSaturation: 36, featherMinBrightness: 210, featherMaxSaturation: 48, featherAlpha: 95 };
  }
  return { bgMinBrightness: 232, bgMaxSaturation: 28, featherMinBrightness: 220, featherMaxSaturation: 35, featherAlpha: 120 };
};

const stripWhiteBackground = (rgbaBuffer: Buffer, width: number, height: number, level: WhiteRemovalLevel) => {
  const output = Buffer.from(rgbaBuffer);
  const pixels = width * height;
  const visited = new Uint8Array(pixels);
  const backgroundMask = new Uint8Array(pixels);
  const queue: number[] = [];
  const cfg = getLevelConfig(level);

  const idx = (x: number, y: number) => (y * width + x) * 4;
  const pidx = (x: number, y: number) => y * width + x;

  const isBackgroundCandidate = (x: number, y: number) => {
    const i = idx(x, y);
    const r = output[i];
    const g = output[i + 1];
    const b = output[i + 2];
    const a = output[i + 3];
    if (a < 12) return true;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = max;
    const saturation = max - min;

    // "Blanco de fondo" con tolerancia moderada.
    return brightness >= cfg.bgMinBrightness && saturation <= cfg.bgMaxSaturation;
  };

  const tryPush = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pidx(x, y);
    if (visited[p]) return;
    visited[p] = 1;
    if (!isBackgroundCandidate(x, y)) return;
    queue.push(p);
    backgroundMask[p] = 1;
  };

  // Seed: solo píxeles de borde.
  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  // Flood fill 4-neighbors: elimina únicamente fondo conectado a borde.
  for (let head = 0; head < queue.length; head++) {
    const p = queue[head];
    const x = p % width;
    const y = Math.floor(p / width);
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  // Aplica transparencia al fondo detectado.
  for (let p = 0; p < pixels; p++) {
    if (!backgroundMask[p]) continue;
    const i = p * 4;
    output[i + 3] = 0;
  }

  // Feather ligero en borde inmediato para que no quede recorte duro.
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = pidx(x, y);
      if (backgroundMask[p]) continue;
      const i = p * 4;
      if (output[i + 3] === 0) continue;

      const nearBg =
        backgroundMask[pidx(x + 1, y)] ||
        backgroundMask[pidx(x - 1, y)] ||
        backgroundMask[pidx(x, y + 1)] ||
        backgroundMask[pidx(x, y - 1)];

      if (!nearBg) continue;

      const r = output[i];
      const g = output[i + 1];
      const b = output[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const brightness = max;
      const saturation = max - min;

      if (brightness >= cfg.featherMinBrightness && saturation <= cfg.featherMaxSaturation) {
        output[i + 3] = Math.min(output[i + 3], cfg.featherAlpha);
      }
    }
  }

  // Decontaminate: quita halo blanco en borde semitransparente.
  for (let i = 0; i < output.length; i += 4) {
    const a = output[i + 3];
    if (a === 0 || a >= 250) continue;
    const alpha = a / 255;
    for (let c = 0; c < 3; c++) {
      const value = output[i + c];
      const unmatted = (value - (1 - alpha) * 255) / Math.max(alpha, 0.01);
      output[i + c] = Math.max(0, Math.min(255, Math.round(unmatted)));
    }
  }

  return output;
};

const readImageBuffer = async (input: string): Promise<Buffer | null> => {
  if (isDataUrl(input)) {
    const base64Data = input.substring(input.indexOf(',') + 1);
    return Buffer.from(base64Data, 'base64');
  }

  if (isRemoteUrl(input)) {
    const resp = await fetch(input);
    if (!resp.ok) {
      throw new Error(`No se pudo descargar imagen: ${resp.status}`);
    }
    const arr = await resp.arrayBuffer();
    return Buffer.from(arr);
  }

  return null;
};

export const processToWebp = async (
  input: string | undefined,
  sku: string,
  slot: string,
  publicBaseUrl: string,
  options?: { removeWhiteBackground?: boolean; whiteRemovalLevel?: WhiteRemovalLevel }
): Promise<string | undefined> => {
  if (!input || !input.trim()) return undefined;
  if (isAlreadyLocalUpload(input) || isCloudinaryUrl(input)) return input;

  const sourceBuffer = await readImageBuffer(input.trim());
  if (!sourceBuffer) return input;

  const fileName = `${sanitizeSku(sku)}-${slot}-${Date.now()}`;
  const removeWhiteBackground = options?.removeWhiteBackground ?? true;
  const whiteRemovalLevel = options?.whiteRemovalLevel || 'medium';

  const preprocessed = await sharp(sourceBuffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelBuffer = removeWhiteBackground
    ? stripWhiteBackground(preprocessed.data, preprocessed.info.width, preprocessed.info.height, whiteRemovalLevel)
    : preprocessed.data;

  const outputBuffer = await sharp(pixelBuffer, {
    raw: {
      width: preprocessed.info.width,
      height: preprocessed.info.height,
      channels: 4
    }
  })
    .webp({ quality: 75, effort: 4 })
    .toBuffer();

  if (cloudinaryEnabled) {
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: fileName,
          resource_type: 'image',
          format: 'webp',
          overwrite: true
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload sin resultado'));
          resolve({ secure_url: result.secure_url });
        }
      );
      uploadStream.end(outputBuffer);
    });

    return uploadResult.secure_url;
  }

  await ensureUploadsDir();
  const outputPath = path.join(UPLOADS_DIR, `${fileName}.webp`);
  await fs.writeFile(outputPath, outputBuffer);
  return `${publicBaseUrl}/uploads/products/${fileName}.webp`;
};
