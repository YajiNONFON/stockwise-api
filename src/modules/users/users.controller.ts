import { NextFunction, Request, Response } from "express";
import { userService } from "./users.service";
import { UnauthorizedException } from "../../shared/errors/http-errors";
import { UpdateUserDto } from "./users.dto";

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) throw new UnauthorizedException("Unauthorized");

      const user = await userService.getProfile(userId);

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) throw new UnauthorizedException("Unauthorized");

      const data = UpdateUserDto.parse(req.body);

      const user = await userService.updateProfile(userId, data);

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) throw new UnauthorizedException("Unauthorized");

      await userService.deleteAccount(userId);

      res.status(200).json({ message: "Account deleted" });
    } catch (error) {
      next(error);
    }
  },
};
