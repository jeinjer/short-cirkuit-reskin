import React, { useEffect, useState } from 'react';
import { X, Upload, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import CircuitLoader from '../../others/CircuitLoader';

const LEVEL_CONFIG = {
  low: { bgMinBrightness: 252, bgMaxSaturation: 8, featherMinBrightness: 248, featherMaxSaturation: 12, featherAlpha: 210 },
  medium: { bgMinBrightness: 232, bgMaxSaturation: 28, featherMinBrightness: 220, featherMaxSaturation: 35, featherAlpha: 120 },
  high: { bgMinBrightness: 222, bgMaxSaturation: 36, featherMinBrightness: 210, featherMaxSaturation: 48, featherAlpha: 95 }
};

const loadImagePixels = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const max = 1000;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      resolve({ imageData, canvas, ctx });
    } catch (e) {
      reject(e);
    }
  };
  img.onerror = reject;
  img.src = src;
});

const stripWhiteBackgroundPreview = (imageData, level = 'medium') => {
  const { data, width, height } = imageData;
  const output = new Uint8ClampedArray(data);
  const pixels = width * height;
  const visited = new Uint8Array(pixels);
  const backgroundMask = new Uint8Array(pixels);
  const queue = [];
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.medium;

  const pidx = (x, y) => y * width + x;
  const idx = (x, y) => pidx(x, y) * 4;

  const isBackgroundCandidate = (x, y) => {
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

    return brightness >= cfg.bgMinBrightness && saturation <= cfg.bgMaxSaturation;
  };

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = pidx(x, y);
    if (visited[p]) return;
    visited[p] = 1;
    if (!isBackgroundCandidate(x, y)) return;
    queue.push(p);
    backgroundMask[p] = 1;
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  for (let head = 0; head < queue.length; head++) {
    const p = queue[head];
    const x = p % width;
    const y = Math.floor(p / width);
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  for (let p = 0; p < pixels; p++) {
    if (!backgroundMask[p]) continue;
    output[p * 4 + 3] = 0;
  }

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

  return new ImageData(output, width, height);
};

const cropToVisiblePixels = (imageData, padding = 6) => {
  const { data, width, height } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return imageData;

  const left = Math.max(0, minX - padding);
  const top = Math.max(0, minY - padding);
  const right = Math.min(width - 1, maxX + padding);
  const bottom = Math.min(height - 1, maxY + padding);
  const outW = right - left + 1;
  const outH = bottom - top + 1;
  const out = new Uint8ClampedArray(outW * outH * 4);

  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const src = ((top + y) * width + (left + x)) * 4;
      const dst = (y * outW + x) * 4;
      out[dst] = data[src];
      out[dst + 1] = data[src + 1];
      out[dst + 2] = data[src + 2];
      out[dst + 3] = data[src + 3];
    }
  }

  return new ImageData(out, outW, outH);
};

export default function EditProductModal({ product, onClose, onSave }) {
  const [mainImage, setMainImage] = useState(product.imageUrl || '');
  const [previewImage, setPreviewImage] = useState(product.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [removeWhiteBackground, setRemoveWhiteBackground] = useState(true);
  const [whiteRemovalLevel, setWhiteRemovalLevel] = useState('medium');
  const isBusy = loading || previewing;

  useEffect(() => {
    let cancelled = false;

    const buildPreview = async () => {
      if (!mainImage) {
        setPreviewImage('');
        return;
      }

      if (!removeWhiteBackground) {
        setPreviewImage(mainImage);
        return;
      }

      try {
        setPreviewing(true);
        const { imageData, canvas, ctx } = await loadImagePixels(mainImage);
        const processed = stripWhiteBackgroundPreview(imageData, whiteRemovalLevel);
        const cropped = cropToVisiblePixels(processed, 8);
        canvas.width = cropped.width;
        canvas.height = cropped.height;
        ctx.putImageData(cropped, 0, 0);
        const url = canvas.toDataURL('image/png');
        if (!cancelled) setPreviewImage(url);
      } catch {
        if (!cancelled) setPreviewImage(mainImage);
      } finally {
        if (!cancelled) setPreviewing(false);
      }
    };

    buildPreview();

    return () => {
      cancelled = true;
    };
  }, [mainImage, removeWhiteBackground, whiteRemovalLevel]);

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setMainImage(dataUrl);
    } catch {
      toast.error('Error al cargar imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave({
      imageUrl: mainImage,
      gallery: [],
      isActive: product.isActive,
      removeWhiteBackground,
      whiteRemovalLevel
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-xl p-4 sm:p-6 relative shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_55%)] rounded-2xl" />
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X /></button>

        <div className="relative text-center mb-5">
          <h3 className="text-xl font-black text-white">Editar imágen</h3>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{product.name || 'Producto'}</p>
          <p className="text-sm text-gray-400 mt-1">SKU: <span className="text-cyan-300 font-semibold">{product.sku}</span></p>
        </div>

        <div className="relative space-y-4 mb-6">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors relative group bg-white/2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              disabled={loading}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className="group-hover:scale-[1.02] transition-transform">
              {loading ? <Loader2 className="mx-auto text-cyan-400 mb-2 animate-spin" /> : <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-cyan-400" />}
              <p className="text-sm text-gray-300 font-semibold">
                {loading ? 'Cargando imagen...' : 'Seleccionar imagen (JPG, PNG, WEBP)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Previsualizacion en tiempo real del recorte</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2">
            <label className="h-10 px-3 rounded-lg border border-white/15 bg-white/5 text-sm text-gray-300 inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={removeWhiteBackground}
                onChange={(e) => setRemoveWhiteBackground(e.target.checked)}
              />
              Quitar fondo blanco
            </label>

            <select
              value={whiteRemovalLevel}
              disabled={!removeWhiteBackground}
              onChange={(e) => setWhiteRemovalLevel(e.target.value)}
              className="h-10 px-3 rounded-lg border border-white/15 bg-white/5 text-sm text-gray-200 disabled:opacity-50"
            >
              <option value="low">Conservador</option>
              <option value="medium">Balanceado (Recomendado)</option>
              <option value="high">Agresivo</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {isBusy && (
              <div className="py-3 flex justify-center">
                <CircuitLoader size="sm" label={loading ? 'Cargando imagen' : 'Generando preview'} />
              </div>
            )}

            {previewImage ? (
              <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-[linear-gradient(45deg,#ececec_25%,#f7f7f7_25%,#f7f7f7_50%,#ececec_50%,#ececec_75%,#f7f7f7_75%)] bg-size-[18px_18px] rounded-lg overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                <img src={previewImage} className="max-w-full max-h-full object-contain object-center mx-auto block" alt="" />
                <div className="absolute bottom-0 w-full bg-cyan-600 text-[12px] text-center text-white py-1 font-bold">Vista previa</div>
                <button onClick={() => setMainImage('')} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded shadow-md hover:bg-red-600 cursor-pointer"><X size={12} /></button>
              </div>
            ) : (
              <div className="h-28 rounded-lg border border-white/10 bg-black/30 flex items-center justify-center text-sm text-gray-500">
                Este producto no tiene imagen cargada
              </div>
            )}
          </div>
        </div>

        <div className="relative flex justify-center gap-3 pt-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 cursor-pointer transition-colors">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={isBusy || !mainImage}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
          >
            {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isBusy ? 'Procesando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
