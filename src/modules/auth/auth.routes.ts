import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Google and Facebook OAuth authentication
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication successful — returns user + tokens
 *       401:
 *         description: Authentication failed
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req, res) => {
    await authController.handleOAuthSuccess(req, res);
  },
);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Sign in with Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Facebook OAuth
 */
authRouter.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  }),
);

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication successful — returns user + tokens
 *       401:
 *         description: Authentication failed
 */
authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req, res) => {
    await authController.handleOAuthSuccess(req, res);
  },
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Get a new access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "a1b2c3d4e5f6..."
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid or expired refresh token
 */
authRouter.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "a1b2c3d4e5f6..."
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/logout", authMiddleware, authController.logout);

/**
 * @swagger
 * /auth/failed:
 *   get:
 *     summary: OAuth authentication failed
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Authentication failed
 */
authRouter.get("/failed", (req, res) => {
  res.status(401).json({ message: "OAuth authentication failed" });
});

// auth.routes.ts — temporaire
authRouter.get('/debug/users', async (req, res) => {
  const { prisma } = await import('../../infrastructure/database/prisma.cloud')
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      provider: true,
      providerId: true,
    },
  })
  res.json(users)
})