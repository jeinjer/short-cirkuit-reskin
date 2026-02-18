import { Router } from 'express';
import { PaymentMethod, PaymentStatus, PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import { getDolarRate } from '../utils/dolar';
import { discountStockForOrder } from '../utils/orders';

const router = Router();
const prisma = new PrismaClient();

const MP_API_BASE = 'https://api.mercadopago.com';
const FRONTEND_URL = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
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

const createWhatsAppUrl = (order: {
  id: string;
  paymentMethod: PaymentMethod;
  subtotalArs: number;
  items: Array<{ name: string; sku: string; quantity: number }>;
}) => {
  const message = [
    'Hola! Quiero continuar con mi pedido.',
    `Número de pedido: #${order.id}`
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
    const { paymentMethod, phone, notes } = req.body as {
      paymentMethod: PaymentMethod;
      phone: string;
      notes?: string;
    };

    if (!paymentMethod || !Object.values(PaymentMethod).includes(paymentMethod)) {
      return res.status(400).json({ error: 'paymentMethod inválido' });
    }
    if (!phone || String(phone).trim().length < 6) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }

    const [cartItems, exchangeRate] = await Promise.all([
      prisma.cartItem.findMany({ where: { userId }, select: cartCheckoutSelect }),
      getDolarRate()
    ]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
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
      paymentMethod,
      paymentStatus: paymentMethod === PaymentMethod.LOCAL ? PaymentStatus.PENDING : PaymentStatus.PENDING,
      status: paymentMethod === PaymentMethod.LOCAL ? 'PENDING_PICKUP' : 'PENDING_PAYMENT',
      subtotalUsd,
      subtotalArs,
      exchangeRate,
      phone: String(phone).trim(),
      notes: notes?.trim() || null,
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

      if (paymentMethod === PaymentMethod.LOCAL) {
        await discountStockForOrder(tx, order.id);
      }

      await tx.cartItem.deleteMany({ where: { userId } });
      return order;
    });

    const whatsappUrl = createWhatsAppUrl({
      id: createdOrder.id,
      paymentMethod: createdOrder.paymentMethod,
      subtotalArs: createdOrder.subtotalArs,
      items: createdOrder.items.map((item) => ({ name: item.name, sku: item.sku, quantity: item.quantity }))
    });

    await prisma.order.update({
      where: { id: createdOrder.id },
      data: { whatsappUrl }
    });

    if (paymentMethod === PaymentMethod.MERCADO_PAGO) {
      const mpToken = process.env.MP_ACCESS_TOKEN;
      if (!mpToken) {
        return res.status(500).json({ error: 'Mercado Pago no está configurado' });
      }

      const mpResponse = await fetch(`${MP_API_BASE}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpToken}`
        },
        body: JSON.stringify({
          items: createdOrder.items.map((item) => ({
            title: `${item.name} (${item.sku})`,
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: Number((item.unitPriceUsd * createdOrder.exchangeRate).toFixed(2))
          })),
          external_reference: createdOrder.id,
          notification_url: `${BACKEND_URL}/api/checkout/mercadopago/webhook`,
          back_urls: {
            success: `${FRONTEND_URL}/checkout?payment=success&order=${createdOrder.id}`,
            failure: `${FRONTEND_URL}/checkout?payment=failure&order=${createdOrder.id}`,
            pending: `${FRONTEND_URL}/checkout?payment=pending&order=${createdOrder.id}`
          },
          auto_return: 'approved'
        })
      });

      if (!mpResponse.ok) {
        const mpError = await mpResponse.text();
        console.error('Error Mercado Pago preference:', mpError);
        return res.status(502).json({ error: 'No se pudo crear la preferencia de pago' });
      }

      const preference: any = await mpResponse.json();
      await prisma.order.update({
        where: { id: createdOrder.id },
        data: {
          mpPreferenceId: preference.id || null,
          mpInitPoint: preference.init_point || preference.sandbox_init_point || null
        }
      });

      return res.json({
        orderId: createdOrder.id,
        paymentMethod: createdOrder.paymentMethod,
        whatsappUrl,
        mercadoPago: {
          preferenceId: preference.id,
          initPoint: preference.init_point || preference.sandbox_init_point
        }
      });
    }

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

router.post('/mercadopago/webhook', async (req, res) => {
  try {
    const mpToken = process.env.MP_ACCESS_TOKEN;
    if (!mpToken) return res.status(200).json({ ok: true });

    const type = (req.query.type || req.query.topic) as string | undefined;
    const dataId = (req.query['data.id'] || req.query.id) as string | undefined;

    if (type !== 'payment' || !dataId) {
      return res.status(200).json({ ok: true });
    }

    const paymentResp = await fetch(`${MP_API_BASE}/v1/payments/${dataId}`, {
      headers: { 'Authorization': `Bearer ${mpToken}` }
    });

    if (!paymentResp.ok) {
      const body = await paymentResp.text();
      console.error('Error consultando pago MP:', body);
      return res.status(200).json({ ok: true });
    }

    const payment: any = await paymentResp.json();
    const orderId = payment.external_reference;
    if (!orderId) return res.status(200).json({ ok: true });

    const status = String(payment.status || '').toLowerCase();

    await prisma.$transaction(async (tx) => {
      if (status === 'approved') {
        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'APPROVED',
            status: 'CONFIRMED'
          }
        });
        await discountStockForOrder(tx, orderId);
      } else if (status === 'rejected' || status === 'cancelled') {
        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'REJECTED',
            status: 'CANCELLED'
          }
        });
      }
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook MP error:', error);
    return res.status(200).json({ ok: true });
  }
});

export default router;






