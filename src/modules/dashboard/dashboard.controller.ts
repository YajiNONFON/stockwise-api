import { NextFunction, Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const period = (req.query.period as string) || "today";

      if (!["today", "week", "month"].includes(period)) {
        res
          .status(400)
          .json({ message: "Invalid period. Use: today, week, month" });
        return;
      }

      const stats = await dashboardService.getDashboard(
        userId,
        period as "today" | "week" | "month",
      );
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },
};
