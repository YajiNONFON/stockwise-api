import { NotFoundException } from "../../shared/errors/http-errors";
import { CreateProductInput, UpdateProductInput } from "./products.dto";
import { productRepository } from "./products.repository";

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

    return product;
  },

  async getAllProducts(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const products = await productRepository.getAllProducts(
      userId,
      page,
      limit,
      search,
    );

    return products;
  },

  async getProductById(id: string, userId: string) {
    return this.findOrFail(id, userId);
  },

  async updateProduct(id: string, userId: string, data: UpdateProductInput) {
    const product = await this.findOrFail(id, userId);

    const updatedProduct = await productRepository.updateProduct(id, data);

    return updatedProduct;
  },

  async deleteProduct(id: string, userId: string) {
    const product = await this.findOrFail(id, userId);

    const deletedProduct = await productRepository.deleteProduct(id, userId);

    return deletedProduct;
  },
};
