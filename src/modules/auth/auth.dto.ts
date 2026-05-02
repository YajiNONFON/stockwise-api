import { z } from "zod";

export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const OAuthCallbackDto = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  provider: z.enum(["GOOGLE", "FACEBOOK"]),
  providerId: z.string().min(1),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenDto>;
export type OAuthCallbackInput = z.infer<typeof OAuthCallbackDto>;
