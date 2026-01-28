import { Router } from 'express';
import { Category, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getDolarRate } from '../utils/dolar';

const router = Router();
const prisma = new PrismaClient();

const productSelect = {
  id: true,
  sku: true,
  name: true,
  brand: true,
  category: true,
  imageUrl: true,
  inStock: true,
  gallery: true,
  isActive: true,
  costPrice: true,
  priceUsd: true
};

const isAdminUser = (req: any): boolean => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.role === 'ADMIN';
  } catch (error) {
    return false;
  }
};

const formatProduct = (product: any, isAdmin: boolean, exchangeRate: number) => {
  if (isAdmin) {
    return {
      ...product,
      price: Math.ceil((product.costPrice || 0) * exchangeRate),
      
      costPrice: product.costPrice,
      priceUsd: product.priceUsd,
      quantity: product.quantity,
    };
  }

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    brand: product.brand,
    category: product.category,
    imageUrl: product.imageUrl,
    inStock: product.inStock,
    gallery: product.gallery,
    isActive: product.isActive,
    quantity: product.quantity,
    
    price: Math.ceil((product.priceUsd || 0) * exchangeRate), 
    
    costPrice: undefined,
    priceUsd: undefined
  };
};


router.get('/:term', async (req, res) => {
  const { term } = req.params;

  try {
    let rawProduct;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(term);

    if (isMongoId) {
      rawProduct = await prisma.product.findUnique({
        where: { id: term },
        select: productSelect
      });
    }

    if (!rawProduct) {
      rawProduct = await prisma.product.findUnique({
        where: { sku: term },
        select: productSelect
      });
    }

    if (!rawProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const isAdmin = isAdminUser(req);

    if (!isAdmin && !rawProduct.isActive) {
        return res.status(404).json({ error: 'Producto no disponible' });
    }

    const currentRate = await getDolarRate();

    const productDTO = formatProduct(rawProduct, isAdmin, currentRate);
    res.json(productDTO);

  } catch (error) {
    console.error(`Error al obtener producto ${term}:`, error);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:sku', async (req, res) => {
    const { sku } = req.params;
    const { isActive, gallery, imageUrl } = req.body;

    if (!isAdminUser(req)) {
        return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }
  
    try {
      const updated = await prisma.product.update({
        where: { sku },
        data: {
          isActive: isActive !== undefined ? isActive : undefined,
          gallery: gallery !== undefined ? gallery : undefined,
          imageUrl: imageUrl !== undefined ? imageUrl : undefined
        },
        select: productSelect
      });
      
      res.json(updated);

    } catch (error) {
      console.error(`Error al actualizar producto ${sku}:`, error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const { category, search, minPrice, maxPrice, sort, brand } = req.query;

  try {
    const isAdmin = isAdminUser(req);
    const whereClause: any = {};

    if (!isAdmin) {
        whereClause.isActive = true;
    }

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
        { sku: { contains: searchStr, mode: 'insensitive' } }
      ];
    }

    let orderBy: any = { priceUsd: 'asc' };
    switch (sort) {
      case 'price_desc': orderBy = { priceUsd: 'desc' }; break;
      case 'price_asc': orderBy = { priceUsd: 'asc' }; break;
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
    }

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy,
        select: productSelect,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const currentRate = await getDolarRate();

    const cleanProducts = rawProducts.map(p => formatProduct(p, isAdmin, currentRate));

    res.json({
      data: cleanProducts,
      meta: { total, page, last_page: Math.ceil(total / limit) },
    });

  } catch (error) {
    console.error('Error en /api/products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

export default router;