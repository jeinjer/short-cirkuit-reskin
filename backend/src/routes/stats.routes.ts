import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  try {
    const [usersCount, productsCount, outOfStockCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({
        where: {
          OR: [
            { inStock: false },
            { quantity: { lte: 0 } }
          ]
        }
      })
    ]);

    res.json({
      users: usersCount,
      products: productsCount,
      sinStock: outOfStockCount
    });
  } catch (error) {
    console.error('Error stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
