import { prisma } from "../../infrastructure/database/prisma.cloud";
import { CreateCustomerInput, UpdateCustomerInput } from "./customers.dto";

export const customerRepository = {
  async getCustomerById(id: string, userId: string) {
    return await prisma.customer.findFirst({
      where: { id, userId, deletedAt: null },
    });
  },

  async getAllCustomers(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where: {
          userId,
          deletedAt: null,
          ...(search && {
            OR: [{ name: { contains: search, mode: "insensitive" } }],
          }),
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({
        where: {
          userId,
          deletedAt: null,
          ...(search && {
            OR: [{ name: { contains: search, mode: "insensitive" } }],
          }),
        },
      }),
    ]);
    return { data, total };
  },

  async createCustomer(userId: string, data: CreateCustomerInput) {
    return await prisma.customer.create({
      data: {
        userId,
        name: data.name,
        whatsapp: data.whatsapp,
        notes: data.notes,
      },
    });
  },

  async updateCustomer(id: string, data: UpdateCustomerInput) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  },

  async deleteCustomer(id: string, userId: string) {
    return prisma.customer.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  },
};
