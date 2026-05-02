import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { userController } from "./users.controller";

export const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890"
 *                     email:
 *                       type: string
 *                       example: "aminata@gmail.com"
 *                     name:
 *                       type: string
 *                       example: "Aminata Diallo"
 *                     avatar:
 *                       type: string
 *                       example: "https://lh3.googleusercontent.com/photo.jpg"
 *                     provider:
 *                       type: string
 *                       example: "GOOGLE"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.get("/me", authMiddleware, userController.getProfile);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
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
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Aminata Diallo"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/photo.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.patch("/me", authMiddleware, userController.updateProfile);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.delete("/me", authMiddleware, userController.deleteAccount);
