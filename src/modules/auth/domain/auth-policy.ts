import { RefreshToken } from "../../../../generated/prisma/client";

export const authPolicy = {
  isRefreshTokenValid(token: RefreshToken): boolean {
    if (token.revokedAt !== null) return false;
    if (token.expiresAt < new Date()) return false;
    return true;
  },
};
