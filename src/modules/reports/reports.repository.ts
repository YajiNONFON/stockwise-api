import { prisma } from "../../infrastructure/database/prisma.cloud";
import { ReportFilterInput } from "./reports.dto";

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

export const reportsRepository = {
  async getOrdersForReport(userId: string, filters: ReportFilterInput) {
    let dateFilter = {};

    if (filters.period) {
      const { start, end } = getDateRange(filters.period);
      dateFilter = { gte: start, lte: end };
    } else if (filters.startDate || filters.endDate) {
      dateFilter = {
        ...(filters.startDate && { gte: new Date(filters.startDate) }),
        ...(filters.endDate && { lte: new Date(filters.endDate) }),
      };
    }

    return prisma.order.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(filters.status && { status: filters.status }),
        ...(Object.keys(dateFilter).length > 0 && {
          createdAt: dateFilter,
        }),
      },
      include: {
        customer: {
          select: { id: true, name: true, whatsapp: true },
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
