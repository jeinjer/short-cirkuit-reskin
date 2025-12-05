import { Router } from 'express';
import { Category } from '@prisma/client';
import { prisma } from '../prisma';

const router = Router();

/**
 * @openapi
 * /api/filters:
 *   get:
 *     summary: Obtener filtros inteligentes según productos
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría a filtrar
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o marca
 *     responses:
 *       200:
 *         description: Filtros dinámicos generados a partir de los productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiltersResponse'
 *       500:
 *         description: Error obteniendo filtros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  try {
    const whereClause: any = {};

    if (category && typeof category === 'string') {
      const catUpper = category.toUpperCase();
      if (Object.keys(Category).includes(catUpper)) {
        whereClause.category = catUpper as Category;
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      select: { brand: true, priceUsd: true, specs: true },
    });

    const brandCounts: Record<string, number> = {};
    let minPrice = Infinity;
    let maxPrice = 0;

    const rams = new Set<string>();
    const storages = new Set<string>();
    const cpus = new Set<string>();
    const panels = new Set<string>();
    const refreshRates = new Set<string>();
    const screenSizes = new Set<string>();
    const printTypes = new Set<string>();

    products.forEach((p) => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      if (p.priceUsd < minPrice) minPrice = p.priceUsd;
      if (p.priceUsd > maxPrice) maxPrice = p.priceUsd;

      if (p.specs) {
        if (p.specs.ram) rams.add(p.specs.ram);
        if (p.specs.storage) storages.add(p.specs.storage);
        if (p.specs.panelType) panels.add(p.specs.panelType);
        if (p.specs.refreshRate) refreshRates.add(p.specs.refreshRate);
        if (p.specs.screenSize) screenSizes.add(String(p.specs.screenSize));
        if (p.specs.printType) printTypes.add(p.specs.printType);

        if (p.specs.cpu) {
          const rawCpu = p.specs.cpu.toLowerCase();
          if (rawCpu.includes('ultra 9')) cpus.add('Intel Core Ultra 9');
          else if (rawCpu.includes('ultra 7')) cpus.add('Intel Core Ultra 7');
          else if (rawCpu.includes('ultra 5')) cpus.add('Intel Core Ultra 5');
          else if (rawCpu.includes('i9') || rawCpu.includes('core 9'))
            cpus.add('Intel Core i9');
          else if (rawCpu.includes('i7') || rawCpu.includes('core 7'))
            cpus.add('Intel Core i7');
          else if (rawCpu.includes('i5') || rawCpu.includes('core 5'))
            cpus.add('Intel Core i5');
          else if (rawCpu.includes('i3') || rawCpu.includes('core 3'))
            cpus.add('Intel Core i3');
          else if (rawCpu.includes('ryzen 9')) cpus.add('AMD Ryzen 9');
          else if (rawCpu.includes('ryzen 7')) cpus.add('AMD Ryzen 7');
          else if (rawCpu.includes('ryzen 5')) cpus.add('AMD Ryzen 5');
          else if (rawCpu.includes('ryzen 3')) cpus.add('AMD Ryzen 3');
          else if (rawCpu.includes('athlon')) cpus.add('AMD Athlon');
          else if (rawCpu.includes('celeron')) cpus.add('Intel Celeron');
          else if (rawCpu.includes('pentium')) cpus.add('Intel Pentium');
        }
      }
    });

    const brands = Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const naturalSort = (a: string, b: string) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

    res.json({
      brands,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
      specs: {
        ram: Array.from(rams).sort(naturalSort),
        storage: Array.from(storages).sort(naturalSort),
        cpu: Array.from(cpus).sort(),
        panel: Array.from(panels).sort(),
        hz: Array.from(refreshRates).sort(naturalSort),
        screen: Array.from(screenSizes).sort(naturalSort),
        print_type: Array.from(printTypes).sort(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo filtros' });
  }
});

export default router;
