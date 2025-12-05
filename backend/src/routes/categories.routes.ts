import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

interface CategoryResult {
  name: string;
  count: number;
}

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Obtener categorías con conteo de productos
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías con cantidad de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryCount'
 *       500:
 *         description: Error al obtener categorías
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    const result: CategoryResult[] = (categories as any[]).map((c) => ({
      name: c.category,
      count: c._count.category,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;
