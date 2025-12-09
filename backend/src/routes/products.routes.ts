import { Router } from 'express';
import { Category, PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const removeNullSpecs = (specs: any) => {
  if (!specs || typeof specs !== 'object') return {};
  return Object.fromEntries(
    Object.entries(specs).filter(([_, v]) => v !== null && v !== undefined)
  );
};

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const { category, search, minPrice, maxPrice, sort, brand } = req.query;

  try {
    const whereClause: any = {};

    if (category && typeof category === 'string') {
      const catUpper = category.toUpperCase();
      if (Object.keys(Category).includes(catUpper)) {
        whereClause.category = catUpper as Category;
      }
    }

    if (brand) {
      whereClause.brand = {
        equals: brand as string,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      whereClause.priceUsd = {};
      if (minPrice) whereClause.priceUsd.gte = parseFloat(minPrice as string);
      if (maxPrice) whereClause.priceUsd.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { priceUsd: 'asc' }; // Default
    switch (sort) {
      case 'price_desc': orderBy = { priceUsd: 'desc' }; break;
      case 'price_asc': orderBy = { priceUsd: 'asc' }; break;
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const cleanedProducts = products.map((p) => ({
      ...p,
      specs: removeNullSpecs(p.specs),
    }));

    res.json({
      data: cleanedProducts,
      meta: { total, page, last_page: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error en /api/products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:sku', async (req, res) => {
  const { sku } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ...product, specs: removeNullSpecs(product.specs) });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;