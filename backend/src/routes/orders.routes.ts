import { Router } from 'express';
import { OrderStatus, PaymentMethod, PaymentStatus, PrismaClient } from '@prisma/client';
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware';
import { discountStockForOrder, restockForOrder } from '../utils/orders';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware, adminMiddleware);

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const paymentMethod = req.query.paymentMethod as string | undefined;
    const paymentStatus = req.query.paymentStatus as string | undefined;
    const search = (req.query.search as string | undefined)?.trim();

    const where: any = {};

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }
    if (paymentMethod && Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)) {
      where.paymentMethod = paymentMethod as PaymentMethod;
    }
    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)) {
      where.paymentStatus = paymentStatus as PaymentStatus;
    }

    if (search) {
      const or: any[] = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { items: { some: { sku: { contains: search, mode: 'insensitive' } } } },
        { items: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ];

      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        or.push({ id: search });
      }

      where.OR = or;
    }

    const rawOrders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit + 1
    });

    const hasNextPage = rawOrders.length > limit;
    const orders = hasNextPage ? rawOrders.slice(0, limit) : rawOrders;

    return res.json({
      data: orders,
      meta: {
        page,
        limit,
        has_next_page: hasNextPage
      }
    });
  } catch (error) {
    console.error('Error al listar ordenes:', error);
    return res.status(500).json({ error: 'Error al listar ordenes' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body as { status?: OrderStatus; paymentStatus?: PaymentStatus | null };

    const data: any = {};

    if (status !== undefined) {
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: 'status invalido' });
      }
      data.status = status;
    }

    if (paymentStatus !== undefined && paymentStatus !== null) {
      if (!Object.values(PaymentStatus).includes(paymentStatus)) {
        return res.status(400).json({ error: 'paymentStatus invalido' });
      }
    }

    if (paymentStatus !== undefined) {
      data.paymentStatus = paymentStatus;
    }

    if (data.status === 'CANCELLED') {
      data.paymentStatus = null;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No hay cambios para aplicar' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const previousOrder = await tx.order.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          stockDiscounted: true
        }
      });

      if (!previousOrder) {
        throw new Error('ORDER_NOT_FOUND');
      }

      const order = await tx.order.update({
        where: { id },
        data,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true
        }
      });

      const shouldRestock = previousOrder.stockDiscounted && order.status === 'CANCELLED';
      const shouldDiscount = !previousOrder.stockDiscounted
        && order.status !== 'CANCELLED'
        && (order.status === 'CONFIRMED' || order.paymentStatus === 'APPROVED');

      if (shouldRestock) {
        await restockForOrder(tx, order.id);
      } else if (shouldDiscount) {
        await discountStockForOrder(tx, order.id);
      }

      return order;
    });

    return res.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    console.error('Error al actualizar orden:', error);
    return res.status(500).json({ error: 'Error al actualizar orden' });
  }
});

export default router;
