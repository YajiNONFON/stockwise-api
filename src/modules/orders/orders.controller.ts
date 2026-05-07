import { NextFunction, Request, Response } from "express";
import { CreateOrderInput, UpdateOrderInput } from "./orders.dto";
import { orderService } from "./orders.service";
import { OrderStatus } from "../../../generated/prisma/enums";

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateOrderInput;
      const userId = req.user!.userId;

      const order = await orderService.createOrder(userId, data);

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const userId = req.user!.userId;

      const statusFilter = req.query.status as OrderStatus | undefined;

      const orders = await orderService.getAllOrders(
        userId,
        page,
        limit,
        statusFilter,
        search,
      );

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as { id: string };

      const order = await orderService.getOrderById(id, userId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as UpdateOrderInput;
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      const order = await orderService.updateOrder(id, userId, data);

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;
      const { status } = req.body as { status: OrderStatus };

      const order = await orderService.updateOrderStatus(id, userId, status);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      await orderService.deleteOrder(id, userId);
      res.status(200).json({ message: "order deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
