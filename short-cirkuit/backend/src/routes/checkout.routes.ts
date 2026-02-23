import { Router } from 'express';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import { prisma } from '../prisma';
import { getDolarRate } from '../utils/dolar';

const router = Router();

const WHATSAPP_ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE || '5493541XXXXXX';

const cartCheckoutSelect = {
  id: true,
  quantity: true,
  product: {
    select: {
      id: true,
      sku: true,
      name: true,
      priceUsd: true,
      quantity: true,
      isActive: true,
      inStock: true,
    }
  }
};

const createWhatsAppUrl = (order: { id: string }) => {
  const message = [
    'Hola! Quiero continuar con mi pedido.',
    `Numero de pedido: #${order.id}`
  ].join('\n');

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_ADMIN_PHONE}&text=${encodeURIComponent(message)}`;
};

router.get('/orders/my', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 5));
    const skip = (page - 1) * limit;
    const where = { userId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      data: orders,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al listar órdenes:', error);
    res.status(500).json({ error: 'Error al listar órdenes' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { phone } = req.body as {
      phone?: string | null;
    };

    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
    const isMissingPhone =
      !normalizedPhone ||
      ['NO_INFORMADO', 'SIN_TELEFONO', 'SIN TELEFONO'].includes(normalizedPhone.toUpperCase());

    if (!isMissingPhone && normalizedPhone.length < 6) {
      return res.status(400).json({ error: 'Telefono invalido' });
    }

    const [cartItems, exchangeRate] = await Promise.all([
      prisma.cartItem.findMany({ where: { userId }, select: cartCheckoutSelect }),
      getDolarRate()
    ]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito esta vacio' });
    }

    for (const item of cartItems) {
      const product = item.product;
      if (!product.isActive || !product.inStock || product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para ${product.name} (${product.sku})`
        });
      }
    }

    const subtotalUsd = cartItems.reduce((acc, item) => acc + (item.product.priceUsd * item.quantity), 0);
    const subtotalArs = Math.ceil(subtotalUsd * exchangeRate);

    const baseOrder = {
      userId,
      paymentMethod: PaymentMethod.LOCAL,
      paymentStatus: PaymentStatus.PENDING,
      status: 'PENDING_PAYMENT',
      subtotalUsd,
      subtotalArs,
      exchangeRate,
      phone: isMissingPhone ? '-' : normalizedPhone,
      notes: null,
      items: {
        create: cartItems.map((item) => ({
          productId: item.product.id,
          sku: item.product.sku,
          name: item.product.name,
          unitPriceUsd: item.product.priceUsd,
          quantity: item.quantity,
          subtotalUsd: item.product.priceUsd * item.quantity
        }))
      }
    } as any;

    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: baseOrder, include: { items: true } });
      await tx.cartItem.deleteMany({ where: { userId } });
      return order;
    });

    const whatsappUrl = createWhatsAppUrl({ id: createdOrder.id });

    await prisma.order.update({
      where: { id: createdOrder.id },
      data: { whatsappUrl }
    });

    return res.json({
      orderId: createdOrder.id,
      paymentMethod: createdOrder.paymentMethod,
      whatsappUrl
    });
  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({ error: 'No se pudo generar la orden' });
  }
});

export default router;
