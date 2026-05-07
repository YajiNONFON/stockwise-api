import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from "./orders.dto";
import { orderController } from "./orders.controller";

export const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management — the core module
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - orderItems
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "clx1234567890"
 *               note:
 *                 type: string
 *                 example: "Delivery before Friday"
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "clx0987654321"
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                 whatsappSummary:
 *                   type: string
 *                   example: "📦 *Commande CMD-2026-123456*..."
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer or product not found
 */
orderRouter.post(
  "/",
  authMiddleware,
  validate(CreateOrderDto),
  orderController.createOrder,
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, DELIVERED, CANCELLED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by order number or customer name
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                   example: 42
 *       401:
 *         description: Unauthorized
 */
orderRouter.get("/", authMiddleware, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.get("/:id", authMiddleware, orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update an order (only PENDING orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: "Updated delivery instructions"
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Only PENDING orders can be updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.patch(
  "/:id",
  authMiddleware,
  validate(UpdateOrderDto),
  orderController.updateOrder,
);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DELIVERED, CANCELLED]
 *                 example: "DELIVERED"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.patch(
  "/:id/status",
  authMiddleware,
  validate(UpdateOrderStatusDto),
  orderController.updateOrderStatus,
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order (only PENDING orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       400:
 *         description: Only PENDING orders can be deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.delete("/:id", authMiddleware, orderController.deleteOrder);
