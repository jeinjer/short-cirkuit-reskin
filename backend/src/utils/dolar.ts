import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CONFIG_KEY = 'dolar_venta';

let memoryCache = { value: 0, expires: 0 };
const CACHE_DURATION = 1000 * 60 * 10; 

export const getDolarRate = async (): Promise<number> => {
  const now = Date.now();
  if (memoryCache.value > 0 && now < memoryCache.expires) {
    return memoryCache.value;
  }

  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    const newRate = data.venta;

    await prisma.systemConfiguration.upsert({
      where: { key: CONFIG_KEY },
      update: { value: newRate },
      create: { key: CONFIG_KEY, value: newRate },
    });

    memoryCache = { value: newRate, expires: now + CACHE_DURATION };
    return newRate;

  } catch (error) {
    console.error('Error obteniendo dólar API. Buscando backup en DB...', error);
    const dbConfig = await prisma.systemConfiguration.findUnique({
      where: { key: CONFIG_KEY }
    });

    if (dbConfig) {
      memoryCache = { value: dbConfig.value, expires: now + CACHE_DURATION };
      return dbConfig.value;
    }
    throw new Error('CRITICAL: No se pudo obtener cotización ni de API ni de DB');
  }
};