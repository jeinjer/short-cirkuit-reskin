import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import { getDolarRate } from '../utils/dolar';

const router = Router();
const prisma = new PrismaClient();

const cartItemSelect = {
  id: true,
  quantity: true,
  product: {
    select: {
      id: true,
      sku: true,
      name: true,
      imageUrl: true,
      priceUsd: true,
      quantity: true,
      inStock: true,
      isActive: true,
    }
  }
};

const toCartResponse = async (userId: string) => {
  const [items, exchangeRate] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId },
      select: cartItemSelect,
      orderBy: { createdAt: 'desc' }
    }),
    getDolarRate()
  ]);

  const data = items.map((item) => {
    const unitPriceUsd = item.product.priceUsd || 0;
    const unitPriceArs = Math.ceil(unitPriceUsd * exchangeRate);
    const subtotalUsd = unitPriceUsd * item.quantity;
    const subtotalArs = Math.ceil(subtotalUsd * exchangeRate);

    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        inStock: item.product.inStock,
        isActive: item.product.isActive,
        stockAvailable: item.product.quantity,
      },
      unitPriceUsd,
      unitPriceArs,
      subtotalUsd,
      subtotalArs
    };
  });

  const summary = data.reduce((acc, item) => {
    acc.totalItems += item.quantity;
    acc.totalUsd += item.subtotalUsd;
    acc.totalArs += item.subtotalArs;
    return acc;
  }, { totalItems: 0, totalUsd: 0, totalArs: 0 });

  return { data, summary };
};

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const cart = await toCartResponse(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

router.post('/items', async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!productId) return res.status(400).json({ error: 'productId es requerido' });
    if (qty <= 0) return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive || !product.inStock) {
      return res.status(400).json({ error: 'Producto no disponible' });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    const desiredQty = (existing?.quantity || 0) + qty;
    if (desiredQty > product.quantity) {
      return res.status(400).json({ error: `Stock máximo disponible: ${product.quantity}` });
    }
    if (desiredQty <= 0) return res.status(400).json({ error: 'Sin stock disponible' });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: desiredQty }
      });
    } else {
      await prisma.cartItem.create({
        data: { userId, productId, quantity: desiredQty }
      });
    }

    const cart = await toCartResponse(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error al agregar item al carrito:', error);
    res.status(500).json({ error: 'Error al agregar item al carrito' });
  }
});

router.patch('/items/:productId', async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (Number.isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    const [product, item] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } })
    ]);

    if (!item) return res.status(404).json({ error: 'Item no encontrado en carrito' });
    if (!product || !product.isActive || !product.inStock) {
      return res.status(400).json({ error: 'Producto no disponible' });
    }

    if (qty > product.quantity) {
      return res.status(400).json({ error: `Stock máximo disponible: ${product.quantity}` });
    }

    const finalQty = qty;
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: finalQty }
    });

    const cart = await toCartResponse(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error al actualizar item del carrito:', error);
    res.status(500).json({ error: 'Error al actualizar item del carrito' });
  }
});

router.delete('/items/:productId', async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { productId } = req.params;

    await prisma.cartItem.deleteMany({
      where: { userId, productId }
    });

    const cart = await toCartResponse(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error al eliminar item del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar item del carrito' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.json({ data: [], summary: { totalItems: 0, totalUsd: 0, totalArs: 0 } });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
});

export default router;
