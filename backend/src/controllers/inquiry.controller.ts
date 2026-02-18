import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { productId, message } = req.body;
    const userId = (req as any).user.id as string;

    if (!productId) {
      return res.status(400).json({ error: 'productId es requerido' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        userId,
        productId,
        name: user.name || 'Cliente',
        email: user.email,
        phone: '-',
        message: typeof message === 'string' && message.trim().length > 0 ? message.trim() : null
      },
      include: { product: true }
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la consulta" });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const rawStatus = String(req.query.status || '').toUpperCase();
    const allowedStatuses = ['PENDING', 'READ', 'REPLIED'];
    const status = allowedStatuses.includes(rawStatus) ? rawStatus : undefined;
    const where = status ? { status } : undefined;

    const rawInquiries = await prisma.inquiry.findMany({
      where,
      include: {
        product: true,
        user: { select: { email: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit + 1
    });

    const hasNextPage = rawInquiries.length > limit;
    const inquiries = hasNextPage ? rawInquiries.slice(0, limit) : rawInquiries;

    res.json({
      data: inquiries,
      meta: {
        page,
        limit,
        has_next_page: hasNextPage,
        status: status || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener consultas" });
  }
};

export const getMyInquiries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const where = { userId };

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              imageUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.inquiry.count({ where })
    ]);

    res.json({
      data: inquiries,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus consultas" });
  }
};

export const replyInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reply } = req.body as { reply?: string };

    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'La respuesta es requerida' });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        adminReply: reply.trim(),
        repliedAt: new Date(),
        status: 'REPLIED'
      },
      include: {
        product: true,
        user: { select: { email: true, name: true, avatar: true } }
      }
    });

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Error al responder consulta" });
  }
};

export const markInquiryAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const current = await prisma.inquiry.findUnique({
      where: { id },
      select: { id: true, status: true }
    });

    if (!current) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }

    if (current.status === 'PENDING') {
      const inquiry = await prisma.inquiry.update({
        where: { id },
        data: { status: 'READ' }
      });
      return res.json(inquiry);
    }

    return res.json(current);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado de consulta" });
  }
};
