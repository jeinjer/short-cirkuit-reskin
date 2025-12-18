export const CATEGORY_IMAGES: Record<string, string> = {
  "NOTEBOOKS": "https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/23a70a7b019b584ae08b402b5dd4ab2d/large.png",
  "COMPUTADORAS": "https://cdn-icons-png.freepik.com/512/2330/2330501.png",
  "MONITORES": "https://admincontent.bimobject.com/public/productimages/b3d36b4b-d397-4b62-a403-959dfd7cd6d4/33014e89-e5cd-4c0e-9b4c-091dba1bb2c0/800722?width=675&height=675&compress=true",
  "IMPRESORAS": "https://cdn-icons-png.freepik.com/512/8426/8426469.png",
  "DEFAULT": "https://cdn.creazilla.com/emojis/46760/white-question-mark-emoji-clipart-lg.png"
};

export const PRODUCT_EXCLUSIONS = [
  'CABLE', 'ADAPTADOR', 'CONECTOR', 'FICHA', 'SOPORTE', 'MOCHILA', 'FUNDA', 'MALETIN',
  'TONER', 'CARTUCHO', 'TINTA', 'CINTA', 'RESMA', 'ROLLO', 'RIBBON',
  'MOUSE', 'TECLADO', 'AURICULAR', 'PARLANTE', 'WEBCAM', 'JOYSTICK',
  'GABINETE', 'FUENTE', 'COOLER', 'FAN', 'WATERCOOLER', 'WATER', 'HEATSINK', 'DISIPADOR',
  'MOTHERBOARD', 'PLACA', 'VIDEO', 'MEMORIA', 'DISCO', 'PROCESSOR', 'PROCESADOR',
  'VIDEOWALL', 'PANTALLA INTERACTIVA', 'LFD', 'SIGNAGE', 'JUEGO', 'GIFT', 'OFFICE', 'WINDOWS',
  'SERVICE', 'GARANTIA', 'CAREPACK', 'LICENCIA', 'SOFTWARE',
];

export const RUBROS_MAP: Record<string, string[]> = {
  NOTEBOOKS: ['001-0360', '002-0361'],
  COMPUTADORAS: ['001-1261', '002-1262', '002-0015', '002-1616', '001-1616'],
  MONITORES: ['001-0320', '002-0320'],
  IMPRESORAS: ['001-0607', '001-0601', '001-0604', '001-0605', '001-0606', '001-0600', '001-0602', '001-0603'],
};