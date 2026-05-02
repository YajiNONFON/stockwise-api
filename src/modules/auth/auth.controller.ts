import { Request, Response } from "express";
import { authService } from "./auth.service";
import { RefreshTokenDto } from "./auth.dto";

export const authController = {
  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = RefreshTokenDto.parse(req.body);
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = RefreshTokenDto.parse(req.body);
    await authService.logout(refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  },

  async handleOAuthSuccess(req: Request, res: Response): Promise<void> {
    const user = req.user as any;
    const result = await authService.handleOAuthCallback(user);
    res.status(200).json(result);
  },
};
