import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { customerController } from "./customers.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { CreateCustomerDto, UpdateCustomerDto } from "./customers.dto";

export const customerRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Aminata Diallo"
 *               whatsapp:
 *                 type: string
 *                 example: "+22507123456"
 *               notes:
 *                 type: string
 *                 example: "Regular customer, pays on delivery"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Customer must have at least a name or a WhatsApp number
 *       401:
 *         description: Unauthorized
 */
customerRouter.post(
  "/",
  authMiddleware,
  validate(CreateCustomerDto),
  customerController.createCustomer,
);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name
 *     responses:
 *       200:
 *         description: List of customers
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
 *                   example: 25
 *       401:
 *         description: Unauthorized
 */
customerRouter.get("/", authMiddleware, customerController.getAllCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
customerRouter.get("/:id", authMiddleware, customerController.getCustomerById);

/**
 * @swagger
 * /customers/{id}:
 *   patch:
 *     summary: Update a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Aminata Koné"
 *               whatsapp:
 *                 type: string
 *                 example: "+22507123456"
 *               notes:
 *                 type: string
 *                 example: "Updated note"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
customerRouter.patch(
  "/:id",
  authMiddleware,
  validate(UpdateCustomerDto),
  customerController.updateCustomer,
);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
customerRouter.delete(
  "/:id",
  authMiddleware,
  customerController.deleteCustomer,
);
