import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { productId, name, email, phone, message } = req.body;
    const userId = (req as any).user.id;

    const inquiry = await prisma.inquiry.create({
      data: {
        userId,
        productId,
        name,
        email,
        phone,
        message,
      },
      include: { product: true }
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la consulta" });
  }
};

export const getInquiries = async (_req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        product: true,
        user: { select: { email: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener consultas" });
  }
};