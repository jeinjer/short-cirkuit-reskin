import { Router } from 'express';
import { Category, PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/:sku', async (req, res) => {
  const { sku } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { sku: sku },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);

  } catch (error) {
    console.error(`Error al obtener producto con SKU ${sku}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

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
      const brandStr = (Array.isArray(brand) ? brand[0] : brand) as string;
      whereClause.brand = {
        equals: brandStr.trim(),
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      whereClause.priceUsd = {};
      
      if (minPrice) {
        const parsedMin = parseFloat(minPrice as string);
        if (!isNaN(parsedMin)) whereClause.priceUsd.gte = parsedMin;
      }
      
      if (maxPrice) {
        const parsedMax = parseFloat(maxPrice as string);
        if (!isNaN(parsedMax)) whereClause.priceUsd.lte = parsedMax;
      }
      
      if (Object.keys(whereClause.priceUsd).length === 0) {
        delete whereClause.priceUsd;
      }
    }

    if (search) {
      const searchStr = (search as string).trim();
      whereClause.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { brand: { contains: searchStr, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { priceUsd: 'asc' };
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

    res.json({
      data: products,
      meta: { total, page, last_page: Math.ceil(total / limit) },
    });

  } catch (error) {
    console.error('Error en /api/products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

export default router;