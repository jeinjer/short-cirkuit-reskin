import { Router } from 'express';
import { Category } from '@prisma/client';
import { prisma } from '../prisma';

const router = Router();

const removeNullSpecs = (specs: any) => {
  if (!specs) return {};
  return Object.fromEntries(
    Object.entries(specs).filter(([_, v]) => v !== null && v !== undefined),
  );
};

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Obtener listado paginado de productos
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría (enum Category de Prisma)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o marca
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtro por marca exacta (case-insensitive)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo en USD
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo en USD
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_desc, price_asc, name_asc, name_desc]
 *         description: Criterio de ordenamiento
 *       - in: query
 *         name: ram
 *         schema:
 *           type: string
 *         description: Filtro por RAM (dentro de specs.ram)
 *       - in: query
 *         name: cpu
 *         schema:
 *           type: string
 *         description: Filtro por CPU (dentro de specs.cpu)
 *       - in: query
 *         name: storage
 *         schema:
 *           type: string
 *         description: Filtro por almacenamiento (specs.storage)
 *       - in: query
 *         name: panel
 *         schema:
 *           type: string
 *         description: Tipo de panel (specs.panelType)
 *       - in: query
 *         name: hz
 *         schema:
 *           type: string
 *         description: Frecuencia de refresco (specs.refreshRate)
 *       - in: query
 *         name: screen
 *         schema:
 *           type: string
 *         description: Tamaño de pantalla (specs.screenSize)
 *       - in: query
 *         name: print_type
 *         schema:
 *           type: string
 *         description: Tipo de impresión (specs.printType)
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       500:
 *         description: Error al obtener productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const { category, search, brand, minPrice, maxPrice, sort } = req.query;
  const { ram, cpu, storage, panel, hz, screen, print_type } = req.query;

  try {
    const whereClause: any = {};

    if (category && typeof category === 'string') {
      const catUpper = category.toUpperCase();
      if (Object.keys(Category).includes(catUpper)) {
        whereClause.category = catUpper as Category;
      } else {
        console.warn(
          `[WARN] Categoría ignorada por no existir en schema: ${category}`,
        );
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
      if (minPrice)
        whereClause.priceUsd.gte = parseFloat(minPrice as string);
      if (maxPrice)
        whereClause.priceUsd.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (ram || cpu || storage || panel || hz || screen || print_type) {
      whereClause.specs = { is: {} };

      if (ram)
        whereClause.specs.is.ram = {
          contains: ram as string,
          mode: 'insensitive',
        };
      if (cpu)
        whereClause.specs.is.cpu = {
          contains: cpu as string,
          mode: 'insensitive',
        };
      if (storage)
        whereClause.specs.is.storage = {
          contains: storage as string,
          mode: 'insensitive',
        };

      if (panel)
        whereClause.specs.is.panelType = {
          contains: panel as string,
          mode: 'insensitive',
        };
      if (hz)
        whereClause.specs.is.refreshRate = {
          contains: hz as string,
          mode: 'insensitive',
        };
      if (screen)
        whereClause.specs.is.screenSize = {
          contains: screen as string,
          mode: 'insensitive',
        };
      if (print_type)
        whereClause.specs.is.printType = {
          contains: print_type as string,
          mode: 'insensitive',
        };
    }

    let orderBy: any = { priceUsd: 'asc' };
    switch (sort) {
      case 'price_desc':
        orderBy = { priceUsd: 'desc' };
        break;
      case 'price_asc':
        orderBy = { priceUsd: 'asc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
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

/**
 * @openapi
 * /api/products/{sku}:
 *   get:
 *     summary: Obtener detalle de un producto por SKU
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU del producto
 *     responses:
 *       200:
 *         description: Detalle de producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:sku', async (req, res) => {
  const { sku } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const cleanedProduct = {
      ...product,
      specs: removeNullSpecs(product.specs),
    };

    res.json(cleanedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
