import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { CreateProductDto, UpdateProductDto } from "./products.dto";
import { productController } from "./products.controller";

export const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog and stock management
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stockTotal
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pagne wax"
 *               photo:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/photo.jpg"
 *               price:
 *                 type: number
 *                 example: 5000
 *               stockTotal:
 *                 type: integer
 *                 example: 100
 *               alertThreshold:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: "Tissus"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
productRouter.post(
  "/",
  authMiddleware,
  validate(CreateProductDto),
  productController.createProduct,
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products
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
 *                   example: 50
 *       401:
 *         description: Unauthorized
 */
productRouter.get("/", authMiddleware, productController.getAllProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.get("/:id", authMiddleware, productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 example: "Pagne wax premium"
 *               price:
 *                 type: number
 *                 example: 6000
 *               stockTotal:
 *                 type: integer
 *                 example: 150
 *               alertThreshold:
 *                 type: integer
 *                 example: 15
 *               category:
 *                 type: string
 *                 example: "Tissus"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.patch(
  "/:id",
  authMiddleware,
  validate(UpdateProductDto),
  productController.updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productRouter.delete("/:id", authMiddleware, productController.deleteProduct);
