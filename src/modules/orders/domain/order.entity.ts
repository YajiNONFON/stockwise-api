import { prisma } from "../../../infrastructure/database/prisma.cloud";

export async function generateOrderNumber(
  prefix: string = "CMD-",
): Promise<string> {
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  while (attempts < MAX_ATTEMPTS) {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `${prefix}${year}-${randomDigits}`;

    const existing = await prisma.order.findUnique({ where: { orderNumber } });

    if (!existing) return orderNumber;

    attempts++;
  }

  throw new Error("Failed to generate unique order number after 10 attempts");
}
