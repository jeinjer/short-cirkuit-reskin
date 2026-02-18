import { Prisma, PrismaClient } from '@prisma/client';

type DbClient = PrismaClient | Prisma.TransactionClient;

export const discountStockForOrder = async (db: DbClient, orderId: string) => {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order || order.stockDiscounted) return;

  for (const item of order.items) {
    const product = await db.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;

    const newQuantity = Math.max(0, product.quantity - item.quantity);
    await db.product.update({
      where: { id: product.id },
      data: {
        quantity: newQuantity,
        inStock: newQuantity > 0
      }
    });
  }

  await db.order.update({
    where: { id: orderId },
    data: { stockDiscounted: true }
  });
};
