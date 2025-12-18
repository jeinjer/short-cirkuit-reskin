import { Category } from '@prisma/client';
import { RUBROS_MAP, PRODUCT_EXCLUSIONS } from '../config/catalogConstants';

export function parseCSVLine(text: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else { current += char; }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

export function debeExcluir(nombre: string): boolean {
  return PRODUCT_EXCLUSIONS.some((bad) => nombre.toUpperCase().includes(bad));
}

export function detectarMarca(descripcion: string): string {
    const upper = descripcion.toUpperCase();
    const conocidas = ['DELL', 'ASUS', 'HP', 'LENOVO', 'BROTHER', 'EPSON', 'CX', 'SAMSUNG', 'LG', 'PHILIPS', 'GIGABYTE', 'MSI', 'HIKVISION', 'PERFORMANCE', 'CANON', 'SONY', 'LEXMARK', 'ACER', 'APPLE'];
    for (const marca of conocidas) {
        if (new RegExp(`\\b${marca}\\b`).test(upper)) return marca;
    }
    return 'GENERICO';
}

export function limpiarNombreDisplay(nombreRaw: string): string {
  let nombre = nombreRaw.trim();
  const prefixes = [/^NB\s+/i, /^MFL?C?\s+/i, /^IMP\s+/i, /^LN\s+/i, /^PC\s+/i, /^MONITOR\s+\d+\s+/i];
  for (const p of prefixes) { nombre = nombre.replace(p, ''); }
  return nombre.replace(/\s*\([A-Z0-9\s\+\-]{1,5}\)$/i, '').replace(/\s*\([A-Z]{2,4}$/i, '').replace(/  +/g, ' ').trim();
}

export function getCategoriaFromRubroID(rubroId: string): Category | null {
    for (const [catName, ids] of Object.entries(RUBROS_MAP)) {
        if (ids.includes(rubroId)) return catName as Category;
    }
    return null;
}