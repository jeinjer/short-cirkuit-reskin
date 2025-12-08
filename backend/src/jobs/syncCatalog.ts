import { PrismaClient, Category } from '@prisma/client';

const fetchFn: typeof fetch = (globalThis as any).fetch;

const prisma = new PrismaClient();

const URL_LISTADO = process.env.URL_LISTADO;
if (!URL_LISTADO) {
  throw new Error('URL_LISTADO no está definida en las env vars');
}

const CATEGORY_IMAGES: Record<string, string> = {
  "NOTEBOOKS": "https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/23a70a7b019b584ae08b402b5dd4ab2d/large.png",
  "COMPUTADORAS": "https://cdn-icons-png.freepik.com/512/2330/2330501.png",
  "MONITORES": "https://admincontent.bimobject.com/public/productimages/b3d36b4b-d397-4b62-a403-959dfd7cd6d4/33014e89-e5cd-4c0e-9b4c-091dba1bb2c0/800722?width=675&height=675&compress=true",
  "IMPRESORAS": "https://cdn-icons-png.freepik.com/512/8426/8426469.png",
  "DEFAULT": "https://cdn.creazilla.com/emojis/46760/white-question-mark-emoji-clipart-lg.png"
};

const PRODUCT_EXCLUSIONS = [
  'CABLE', 'ADAPTADOR', 'CONECTOR', 'FICHA', 'SOPORTE', 'MOCHILA', 'FUNDA', 'MALETIN',
  'TONER', 'CARTUCHO', 'TINTA', 'CINTA', 'RESMA', 'ROLLO', 'RIBBON',
  'MOUSE', 'TECLADO', 'AURICULAR', 'PARLANTE', 'WEBCAM', 'JOYSTICK',
  'GABINETE', 'FUENTE', 'COOLER', 'FAN', 'WATERCOOLER', 'WATER', 'HEATSINK', 'DISIPADOR',
  'MOTHERBOARD', 'PLACA', 'VIDEO', 'MEMORIA', 'DISCO', 'PROCESSOR', 'PROCESADOR',
  'VIDEOWALL', 'PANTALLA INTERACTIVA', 'LFD', 'SIGNAGE', 'JUEGO', 'GIFT', 'OFFICE', 'WINDOWS',
  'SERVICE', 'GARANTIA', 'CAREPACK', 'LICENCIA', 'SOFTWARE',
];

const RUBROS_MAP: Record<string, string[]> = {
  NOTEBOOKS: [
    '001-0360', // NOTEBOOKS 
    '002-0361', // NOTEBOOKS CX
  ],

  COMPUTADORAS: [
    '001-1261', // ALL IN ONE
    '002-1262', // ALL IN ONE CX
    '002-0015', // COMPUTADORAS CX
    '002-1616', // MINI PC
    '001-1616', // MINI PC 2
  ],

  MONITORES: [
    '001-0320', // MONITORES
    '002-0320', // MONITORES CX
  ],

  IMPRESORAS: [
    '001-0607', // IMP C/SIST. CONT. 
    '001-0601', // IMP INKJET
    '001-0604', // IMP LASER COLOR
    '001-0605', // IMP LASER NEGRO
    '001-0606', // IMP MF C/SIST. CONT.
    '001-0600', // IMP MF INKJET
    '001-0602', // IMP MF LASER COLOR
    '001-0603', // IMP MF LASER NEGRO
  ],
};

type VendorPrecio = {
  lista?: number;
};

type VendorRubro = {
  name?: string;
};

type VendorGrupo = {
  name?: string;
};

type VendorItem = {
  codiart: string;
  descart: string;
  rubro?: VendorRubro;
  grupo?: VendorGrupo;
  precio?: VendorPrecio;
  _categoria_target?: string;
};

type Specs = {
  ram?: string;
  storage?: string;
  cpu?: string;
  screenSize?: string;
  panelType?: string;
  refreshRate?: string;
  printType?: string;
};


function debeExcluir(nombre: string): boolean {
  const upper = nombre.toUpperCase();
  return PRODUCT_EXCLUSIONS.some((bad) => upper.includes(bad));
}

function limpiarMarca(marcaRaw: string | undefined): string {
  if (!marcaRaw) return 'GENERICO';
  const m = marcaRaw.toUpperCase().trim();

  const conocidas = [
    'DELL', 'ASUS', 'HP', 'LENOVO', 'BROTHER', 'EPSON', 'CX',
    'SAMSUNG', 'LG', 'PHILIPS', 'GIGABYTE', 'MSI', 'HIKVISION',
    'PERFORMANCE', 'CANON', 'SONY', 'LEXMARK',
  ];

  for (const marca of conocidas) {
    if (m.includes(marca)) return marca;
  }

  return marcaRaw
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function limpiarNombreDisplay(nombreRaw: string): string {
  let nombre = nombreRaw.trim();

  const prefixes = [/^NB\s+/i, /^MFL?C?\s+/i, /^IMP\s+/i, /^LN\s+/i, /^LC\s+/i, /^AIO\s+/i];

  for (const p of prefixes) {
    nombre = nombre.replace(p, '');
  }

  nombre = nombre.replace(/\s*\([A-Z0-9\s\+\-]{1,5}\)$/i, '');
  nombre = nombre.replace(/\s*\([A-Z]{2,4}$/i, '');
  nombre = nombre.replace(/  +/g, ' ').trim();

  return nombre;
}

function extraerSpecsDesdeTitulo(titulo: string, categoria: string): Specs {
  const specs: Specs = {};
  const txt = titulo.toUpperCase().replace(/  +/g, ' ');

  const ramMatch = txt.match(/(?<!\d)(\d{1,3})\s*(G|GB)(?!\w|BITS)/);
  if (ramMatch) {
    const val = parseInt(ramMatch[1], 10);
    if (val >= 4 && val <= 128) {
      specs.ram = `${val} GB`;
    }
  }

  let storageStr: string | null = null;

  let m = txt.match(/(?<!\d)(\d+)\s*(T|TB)/);
  if (m) {
    storageStr = `${m[1]} TB SSD`;
  } else {
    m = txt.match(/(?<!\d)(\d{3,4})\s*(G|GB)/);
    if (m) {
      const val = parseInt(m[1], 10);
      if (val >= 120) {
        storageStr = `${val} GB SSD`;
      }
    } else {
      m = txt.match(/SSD\s*(\d{3,4})|(\d{3,4})\s*SSD/);
      if (m) {
        const val = m[1] || m[2];
        if (val) storageStr = `${val} GB SSD`;
      }
    }
  }
  if (storageStr) {
    specs.storage = storageStr;
  }

  if (categoria === 'NOTEBOOKS' || categoria === 'MONITORES') {
    let mScreen =
      txt.match(/(?<!\d)(1[1-8](?:\.\d)?)\s*("|PULG|INCH|’| )/) ??
      txt.match(/\b(14)\b/) ??
      txt.match(/\b(15\.6)\b/);

    if (mScreen && mScreen[1]) {
      specs.screenSize = mScreen[1];
    }
  }

  if (/I[3579]/.test(txt) || /RYZEN/.test(txt) || /CELERON/.test(txt) || /PENTIUM/.test(txt)) {
    const cpuMatchIntelI = txt.match(/I([3579])[- ]?([A-Z0-9]+)/);
    const cpuMatchRyzen = txt.match(/RYZEN\s*(\d)\s*([A-Z0-9]*)/);
    if (cpuMatchIntelI) {
      specs.cpu = `Intel Core i${cpuMatchIntelI[1]}-${cpuMatchIntelI[2]}`;
    } else if (cpuMatchRyzen) {
      specs.cpu = `AMD Ryzen ${cpuMatchRyzen[1]} ${cpuMatchRyzen[2]}`.trim();
    }
  }

  if (categoria === 'MONITORES') {
    const hzMatch = txt.match(/(\d{2,3})\s*HZ/);
    if (hzMatch) specs.refreshRate = `${hzMatch[1]} Hz`;

    if (txt.includes('IPS')) specs.panelType = 'IPS';
    else if (txt.includes('VA')) specs.panelType = 'VA';
  }

  if (categoria === 'IMPRESORAS') {
    if (txt.includes('LASER') || txt.includes('LED')) specs.printType = 'Láser';
    else if (txt.includes('INK') || txt.includes('TINTA')) specs.printType = 'Inyección de Tinta';
  }

  return specs;
}

async function fetchRubro(categoria: string, rubroId: string): Promise<VendorItem[]> {
  const payload = {
    rubro: rubroId,
    orden: 'DA',
    stock: 'T',
    limit: 500,
  };

  const itemsLimpios: VendorItem[] = [];

  try {
    const resp = await fetchFn(URL_LISTADO!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error(`[SYNC] Error HTTP rubro ${rubroId}: ${resp.status}`);
      return [];
    }

    const rawText = await resp.text();
    const data = JSON.parse(rawText) as unknown;

    if (Array.isArray(data)) {
      for (const anyItem of data as any[]) {
        const item = anyItem as VendorItem;
        const sku = item.codiart;
        const nombre = (item.descart || '').trim().toUpperCase();

        if (!sku) continue;
        if (debeExcluir(nombre)) continue;

        if (
          categoria === 'NOTEBOOKS' &&
          !(
            nombre.includes('NB') ||
            nombre.includes('NOTEBOOK') ||
            nombre.includes('LAPTOP')
          )
        ) {
          continue;
        }

        item._categoria_target = categoria;
        itemsLimpios.push(item);
      }
    }
  } catch (e) {
    console.error(`[SYNC] Falló rubro ${rubroId}:`, e);
    return [];
  }

  return itemsLimpios;
}

export async function syncCatalogFromVendor() {
  console.log('🟦 [SYNC] Iniciando sincronización con proveedor');

  const vistos = new Set<string>();
  let created = 0;
  let updated = 0;

  const tareas: Promise<VendorItem[]>[] = [];

  for (const [categoria, rubros] of Object.entries(RUBROS_MAP)) {
    for (const rubroId of rubros) {
      tareas.push(fetchRubro(categoria, rubroId));
    }
  }

  const resultados = await Promise.all(tareas);
  const productosBase: VendorItem[] = resultados.flat();

  console.log(`🟦 [SYNC] Productos base LIMPIOS: ${productosBase.length}`);

  for (const p of productosBase) {
    const sku = p.codiart;
    if (!sku || vistos.has(sku)) continue;
    vistos.add(sku);

    const categoriaRaw = p._categoria_target || 'OTROS';
    const categoriaEnum = categoriaRaw.toUpperCase() as Category;

    const nombreOriginal = p.descart || '';
    const nombreDisplay = limpiarNombreDisplay(nombreOriginal);
    const marcaRaw = p.grupo?.name || '';

    const brand = limpiarMarca(marcaRaw);
    const priceUsd = p.precio?.lista ?? 0;

    const assignedImage = CATEGORY_IMAGES[categoriaEnum] || CATEGORY_IMAGES['DEFAULT'];

    const existing = await prisma.product.findUnique({ where: { sku } });

    if (existing) {
      await prisma.product.update({
        where: { sku },
        data: {
          priceUsd,
        },
      });
      updated++;
    } else {
      const specsFromTitle = extraerSpecsDesdeTitulo(nombreOriginal, categoriaRaw);
      const specs: Specs = {};
      if (specsFromTitle.ram) specs.ram = specsFromTitle.ram;
      if (specsFromTitle.storage) specs.storage = specsFromTitle.storage;
      if (specsFromTitle.cpu) specs.cpu = specsFromTitle.cpu;
      if (specsFromTitle.screenSize) specs.screenSize = specsFromTitle.screenSize;
      if (specsFromTitle.panelType) specs.panelType = specsFromTitle.panelType;
      if (specsFromTitle.refreshRate) specs.refreshRate = specsFromTitle.refreshRate;
      if (specsFromTitle.printType) specs.printType = specsFromTitle.printType;

      await prisma.product.create({
        data: {
          sku,
          name: nombreDisplay,
          brand,
          priceUsd,
          category: categoriaEnum,
          specs,
          imageUrl: assignedImage, // Aquí sí asignamos la imagen por defecto
        },
      });
      created++;
    }
  }

  console.log(
    `🟩 [SYNC] Finalizado. Nuevos: ${created}, Actualizados (precio): ${updated}, SKUs únicos: ${vistos.size}`,
  );
}