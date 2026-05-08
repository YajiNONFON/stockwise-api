import { pdfService } from "../../infrastructure/pdf/pdf.service";
import { excelService } from "../../infrastructure/excel/excel.service";
import { ReportFilterInput } from "./reports.dto";
import { reportsRepository } from "./reports.repository";

export const reportService = {
  async generatePdfReport(userId: string, filters: ReportFilterInput) {
    const orders = await reportsRepository.getOrdersForReport(userId, filters);

    const normalized = orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
      })),
    }));

    const buffer = await pdfService.generateOrderReport(normalized);
    return buffer;
  },

  async generateExcelReport(userId: string, filters: ReportFilterInput) {
    const orders = await reportsRepository.getOrdersForReport(userId, filters);

    const normalized = orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
      })),
    }));

    const buffer = await excelService.generateOrdersExport(normalized);
    return buffer;
  },
};
