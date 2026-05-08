import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { reportController } from "./reports.controller";

export const reportRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Export orders as PDF or Excel
 */

/**
 * @swagger
 * /reports/orders/pdf:
 *   get:
 *     summary: Export orders as PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, DELIVERED, CANCELLED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2026-05-01T00:00:00.000Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2026-05-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: PDF file downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
reportRouter.get(
  "/orders/pdf",
  authMiddleware,
  reportController.generatePdfReport,
);

/**
 * @swagger
 * /reports/orders/excel:
 *   get:
 *     summary: Export orders as Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, DELIVERED, CANCELLED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2026-05-01T00:00:00.000Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2026-05-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Excel file downloaded
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
reportRouter.get(
  "/orders/excel",
  authMiddleware,
  reportController.generateExcelReport,
);
