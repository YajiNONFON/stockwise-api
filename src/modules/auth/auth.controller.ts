import { Request, Response } from "express";
import { authService } from "./auth.service";
import { RefreshTokenDto } from "./auth.dto";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const authController = {
  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(200).json({ message: "Logged out successfully" });
  },

  async handleOAuthSuccess(req: Request, res: Response): Promise<void> {
    const user = req.user as any;
    const result = await authService.handleOAuthCallback(user);

    res.cookie(
      "refreshToken",
      result.tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    const clientUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(
      `${clientUrl}/auth/callback?accessToken=${result.tokens.accessToken}`,
    );
  },
};
