import { Product } from "../../../generated/prisma/client";
import { NotFoundException } from "../../shared/errors/http-errors";
import { CreateProductInput, UpdateProductInput } from "./products.dto";
import { productRepository } from "./products.repository";

function withStockAvailable(product: Product) {
  return {
    ...product,
    stockAvailable: product.stockTotal - product.stockReserved,
  };
}

export const productService = {
  async findOrFail(id: string, userId: string) {
    const product = await productRepository.getProductById(id, userId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  },

  async createProduct(userId: string, data: CreateProductInput) {
    const product = await productRepository.createProduct(userId, data);

    return withStockAvailable(product);
  },

  async getAllProducts(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const { data, total } = await productRepository.getAllProducts(
      userId,
      page,
      limit,
      search,
    );

    return {
      data: data.map(withStockAvailable),
      total,
    };
  },

  async getProductById(id: string, userId: string) {
    const product = await this.findOrFail(id, userId);

    return withStockAvailable(product);
  },

  async updateProduct(id: string, userId: string, data: UpdateProductInput) {
    const product = await this.findOrFail(id, userId);

    const updatedProduct = await productRepository.updateProduct(
      id,
      userId,
      data,
    );

    return withStockAvailable(updatedProduct);
  },

  async deleteProduct(id: string, userId: string) {
    const product = await this.findOrFail(id, userId);

    const deletedProduct = await productRepository.deleteProduct(id, userId);

    return deletedProduct;
  },
};
