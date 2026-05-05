import { NextFunction, Request, Response } from "express";
import { CreateProductInput, UpdateProductInput } from "./products.dto";
import { productService } from "./products.service";

export const productController = {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateProductInput;
      const userId = req.user!.userId;

      const product = await productService.createProduct(userId, data);

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const userId = req.user!.userId;

      const products = await productService.getAllProducts(
        userId,
        page,
        limit,
        search,
      );

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as { id: string };

      const product = await productService.getProductById(id, userId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as UpdateProductInput;
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      const product = await productService.updateProduct(id, userId, data);

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      await productService.deleteProduct(id, userId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
