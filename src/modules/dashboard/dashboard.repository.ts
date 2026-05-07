import { prisma } from "../../infrastructure/database/prisma.cloud";

function getDateRange(period: "today" | "week" | "month"): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const start = new Date();

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
}

export const dashboardRepository = {
  async getRevenueStats(userId: string, start: Date, end: Date) {
    const orders = await prisma.order.groupBy({
      by: ["status"],
      where: {
        userId,
        createdAt: { gte: start, lte: end },
        deletedAt: null,
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const delivered = orders.find((o) => o.status === "DELIVERED");
    const pending = orders.find((o) => o.status === "PENDING");
    const cancelled = orders.find((o) => o.status === "CANCELLED");

    const deliveredCount = delivered?._count.id ?? 0;
    const cancelledCount = cancelled?._count.id ?? 0;
    const total = deliveredCount + cancelledCount;

    return {
      real: Number(delivered?._sum.total ?? 0),
      potential: Number(pending?._sum.total ?? 0),
      conversionRate:
        total > 0 ? Math.round((deliveredCount / total) * 100) : 0,
    };
  },

  async getOrderStats(userId: string, start: Date, end: Date) {
    const orders = await prisma.order.groupBy({
      by: ["status"],
      where: {
        userId,
        createdAt: { gte: start, lte: end },
        deletedAt: null,
      },
      _count: { id: true },
    });

    const find = (status: string) =>
      orders.find((o) => o.status === status)?._count.id ?? 0;

    return {
      total: orders.reduce((sum, o) => sum + o._count.id, 0),
      pending: find("PENDING"),
      delivered: find("DELIVERED"),
      cancelled: find("CANCELLED"),
    };
  },

  async getTopProducts(userId: string, start: Date, end: Date) {
    const items = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          userId,
          status: "DELIVERED",
          createdAt: { gte: start, lte: end },
          deletedAt: null,
        },
      },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { subtotal: "desc" } },
      take: 5,
    });

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });

        return {
          productId: item.productId,
          productName: product?.name ?? "Unknown",
          totalQuantity: item._sum.quantity ?? 0,
          totalRevenue: Number(item._sum.subtotal ?? 0),
        };
      }),
    );

    return products;
  },

  async getCriticalStock(userId: string) {
    const products = await prisma.product.findMany({
      where: {
        userId,
        deletedAt: null,
        alertThreshold: { not: null },
      },
      select: {
        id: true,
        name: true,
        stockTotal: true,
        stockReserved: true,
        alertThreshold: true,
      },
    });

    return products
      .filter((p) => p.stockTotal - p.stockReserved < p.alertThreshold!)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        stockAvailable: p.stockTotal - p.stockReserved,
        alertThreshold: p.alertThreshold!,
      }));
  },

  async getActiveCustomers(userId: string, start: Date, end: Date) {
    const customers = await prisma.order.groupBy({
      by: ["customerId"],
      where: {
        userId,
        status: "DELIVERED",
        createdAt: { gte: start, lte: end },
        deletedAt: null,
      },
    });

    return customers.length;
  },

  async getDashboard(userId: string, period: "today" | "week" | "month") {
    const { start, end } = getDateRange(period);

    const [revenue, orders, topProducts, criticalStock, activeCustomers] =
      await Promise.all([
        this.getRevenueStats(userId, start, end),
        this.getOrderStats(userId, start, end),
        this.getTopProducts(userId, start, end),
        this.getCriticalStock(userId),
        this.getActiveCustomers(userId, start, end),
      ]);

    return {
      period,
      revenue,
      orders,
      topProducts,
      criticalStock,
      activeCustomers,
    };
  },
};
