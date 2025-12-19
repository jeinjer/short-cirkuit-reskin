import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  try {
    const [usersCount, productsCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count()
    ]);

    res.json({
      users: usersCount,
      products: productsCount
    });
  } catch (error) {
    console.error('Error stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;