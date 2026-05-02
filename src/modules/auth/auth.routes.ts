import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification OAuth Google et Facebook
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Connexion via Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirige vers Google OAuth
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
 *     summary: Callback Google OAuth
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentification réussie — retourne user + tokens
 *       401:
 *         description: Authentification échouée
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
 *     summary: Connexion via Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirige vers Facebook OAuth
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
 *     summary: Callback Facebook OAuth
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentification réussie — retourne user + tokens
 *       401:
 *         description: Authentification échouée
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
 *     summary: Obtenir un nouvel access token
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
 *     responses:
 *       200:
 *         description: Nouvel access token généré
 *       401:
 *         description: Refresh token invalide ou expiré
 */
authRouter.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion
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
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non autorisé
 */
authRouter.post("/logout", authMiddleware, authController.logout);

/**
 * @swagger
 * /auth/failed:
 *   get:
 *     summary: Échec d'authentification OAuth
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Authentification échouée
 */
authRouter.get("/failed", (req, res) => {
  res.status(401).json({ message: "OAuth authentication failed" });
});
