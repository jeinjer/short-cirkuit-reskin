import { PrismaClient } from '@prisma/client';
import { CATEGORY_IMAGES } from '../config/catalogConstants';
import { 
  parseCSVLine, 
  debeExcluir, 
  detectarMarca, 
  limpiarNombreDisplay, 
  getCategoriaFromRubroID 
} from '../utils/catalogHelpers';

require('dotenv').config();

const fetchFn: typeof fetch = (globalThis as any).fetch;
const prisma = new PrismaClient();
const CSV_URL = process.env.CSV_URL;

export async function syncCatalogFromVendor() {
  console.log('[SYNC] Iniciando sincronización vía CSV...');
  
  if (!CSV_URL) {
      console.error('CSV_URL no está configurada');
      return { success: false, message: 'CSV_URL no configurada' };
  }

  let csvText = '';
  try {
      const resp = await fetchFn(CSV_URL);
      if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
      csvText = await resp.text(); 
  } catch (e) {
      console.error('Error descarga:', e);
      return { success: false, message: 'Error de descarga' };
  }

  const lines = csvText.split('\n');
  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);

  console.log(`CSV Filas totales: ${dataLines.length}`);

  let created = 0;
  let updated = 0;
  let deactivated = 0;
  let skipped = 0;

  for (const line of dataLines) {
      const cols = parseCSVLine(line);
      if (cols.length < 11) continue; 

      const sku = cols[0].trim();
      const descripcion = cols[1].trim();

      if (!sku || debeExcluir(descripcion)) { skipped++; continue; }

      const rubroId = cols[10].trim();
      const categoriaEnum = getCategoriaFromRubroID(rubroId);
      if (!categoriaEnum) { skipped++; continue; }

      const stockCba = parseInt(cols[7], 10);
      const realStock = (!isNaN(stockCba) && stockCba > 0) ? stockCba : 0;
      const hasStockCba = !isNaN(stockCba) && stockCba > 0;

      const existing = await prisma.product.findUnique({ where: { sku } });

      if (hasStockCba) {
          const precioNeto = parseFloat(cols[2]);
          const ivaPorc = parseFloat(cols[4]);

          const costoConIva = precioNeto * (1 + (ivaPorc / 100));
          const precioVentaFinal = costoConIva * 1.15;

          const nombreDisplay = limpiarNombreDisplay(descripcion);
          const brand = detectarMarca(descripcion);
          const assignedImage = CATEGORY_IMAGES[categoriaEnum] || CATEGORY_IMAGES['DEFAULT'];

          const productData = {
              name: nombreDisplay,
              priceUsd: precioVentaFinal,
              costPrice: costoConIva,
              brand: brand,
              category: categoriaEnum,
              inStock: true,
              isActive: true,
              quantity: realStock,
          };

          if (existing) {
              await prisma.product.update({
                  where: { sku },
                  data: {
                      ...productData,
                      imageUrl: existing.imageUrl === CATEGORY_IMAGES['DEFAULT'] ? assignedImage : existing.imageUrl,
                      lastScraped: new Date(),
                      updatedAt: new Date(),
                  },
              });
              updated++;
          } else {
              await prisma.product.create({
                  data: {
                      sku,
                      ...productData,
                      imageUrl: assignedImage,
                  },
              });
              created++;
          }
      } else {
          if (existing) {
              if (existing.isActive || existing.inStock) {
                  await prisma.product.update({
                      where: { sku },
                      data: {
                          inStock: false,
                          isActive: false,
                          quantity: 0,
                          updatedAt: new Date()
                      }
                  });
                  deactivated++;
              }
          }
      }
  }

  const mensaje = `[SYNC] Fin. Nuevos: ${created}, Actualizados: ${updated}, Desactivados: ${deactivated}, Ignorados: ${skipped}`;
  console.log(mensaje);
  
  return {
    success: true,
    message: mensaje,
    stats: { created, updated, deactivated }
  };
}