import { NextFunction, Request, Response } from "express";
import { ReportFilterDto } from "./reports.dto";
import { reportService } from "./reports.service";

export const reportController = {
  async generatePdfReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const filters = ReportFilterDto.parse(req.query);

      const buffer = await reportService.generatePdfReport(userId, filters);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="stockwise-report-${Date.now()}.pdf"`,
      );
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },

  async generateExcelReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const filters = ReportFilterDto.parse(req.query);

      const buffer = await reportService.generateExcelReport(userId, filters);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="stockwise-report-${Date.now()}.xlsx"`,
      );
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },
};
