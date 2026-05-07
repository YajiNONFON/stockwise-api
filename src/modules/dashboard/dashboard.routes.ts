import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { dashboardController } from "./dashboard.controller";

export const dashboardRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Business statistics and KPIs
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *           default: today
 *         description: Time period for statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: "today"
 *                 revenue:
 *                   type: object
 *                   properties:
 *                     real:
 *                       type: number
 *                       example: 150000
 *                     potential:
 *                       type: number
 *                       example: 50000
 *                     conversionRate:
 *                       type: number
 *                       example: 75
 *                 orders:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     pending:
 *                       type: integer
 *                       example: 3
 *                     delivered:
 *                       type: integer
 *                       example: 8
 *                     cancelled:
 *                       type: integer
 *                       example: 1
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                         example: "Pagne wax"
 *                       totalQuantity:
 *                         type: integer
 *                         example: 25
 *                       totalRevenue:
 *                         type: number
 *                         example: 125000
 *                 criticalStock:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                         example: "Cosmétique X"
 *                       stockAvailable:
 *                         type: integer
 *                         example: 2
 *                       alertThreshold:
 *                         type: integer
 *                         example: 5
 *                 activeCustomers:
 *                   type: integer
 *                   example: 8
 *       400:
 *         description: Invalid period
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get("/", authMiddleware, dashboardController.getDashboard);
