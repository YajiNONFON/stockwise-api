import { prisma } from "../../infrastructure/database/prisma.cloud";
import { CreateProductInput, UpdateProductInput } from "./products.dto";

export const productRepository = {
  async getProductById(id: string, userId: string) {
    return await prisma.product.findFirst({
      where: { id, userId, deletedAt: null },
    });
  },

  async getAllProducts(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.product.findMany({
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
      prisma.product.count({
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

  async createProduct(userId: string, data: CreateProductInput) {
    return await prisma.product.create({
      data: {
        userId,
        name: data.name,
        photo: data.photo,
        price: data.price,
        stockTotal: data.stockTotal,
        alertThreshold: data.alertThreshold,
        category: data.category,
      },
    });
  },

  async updateProduct(id: string, userId: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id, userId },
      data,
    });
  },

  async updateStock(
    id: string,
    userId: string,
    stockTotal: number,
    stockReserved: number,
  ) {
    return prisma.product.update({
      where: { id, userId },
      data: { stockTotal, stockReserved },
    });
  },

  async deleteProduct(id: string, userId: string) {
    return prisma.product.update({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
