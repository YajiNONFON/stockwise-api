import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../infrastructure/database/prisma.cloud";
import { CreateOrderInput, UpdateOrderInput } from "./orders.dto";

const customerSelect = {
  id: true,
  name: true,
};

export const orderRepository = {
  async getOrderById(id: string, userId: string) {
    return await prisma.order.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        orderItems: true,
        customer: { select: customerSelect },
      },
    });
  },

  async getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    status?: OrderStatus,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" as const } },
          {
            customer: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: customerSelect },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { data, total };
  },

  async createOrder(
    userId: string,
    orderNumber: string,
    total: number,
    data: CreateOrderInput,
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[],
  ) {
    return await prisma.order.create({
      data: {
        userId,
        orderNumber,
        total,
        status: "PENDING",
        customerId: data.customerId,
        note: data.note,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        orderItems: true,
        customer: { select: customerSelect },
      },
    });
  },

  async updateOrder(
    id: string,
    userId: string,
    data: {
      note?: string;
      total?: number;
      items?: {
        productId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }[];
    },
  ) {
    return prisma.order.update({
      where: { id, userId },
      data: {
        ...(data.note !== undefined && { note: data.note }),
        ...(data.total !== undefined && { total: data.total }),
        ...(data.items && {
          orderItems: {
            deleteMany: { orderId: id },
            create: data.items,
          },
        }),
      },
      include: {
        orderItems: true,
        customer: { select: customerSelect },
      },
    });
  },
  async updateOrderStatus(id: string, userId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id, userId },
      data: { status },
    });
  },

  async deleteOrder(id: string, userId: string) {
    return prisma.order.update({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
