import { NextFunction, Request, Response } from "express";
import { CreateCustomerInput, UpdateCustomerInput } from "./customers.dto";
import { customerService } from "./customers.service";

export const customerController = {
  async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateCustomerInput;
      const userId = req.user!.userId;

      const customer = await customerService.createCustomer(userId, data);

      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  },

  async getAllCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const userId = req.user!.userId;

      const customers = await customerService.getAllCustomers(
        userId,
        page,
        limit,
        search,
      );

      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as { id: string };

      const customer = await customerService.getCustomerById(id, userId);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as UpdateCustomerInput;
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      const customer = await customerService.updateCustomer(id, userId, data);

      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  },

  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.userId;

      await customerService.deleteCustomer(id, userId);
      res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
