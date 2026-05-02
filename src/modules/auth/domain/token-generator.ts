import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JwtPayload } from "../auth.types";
import { env } from "../../../shared/config/env";

const ACCESS_TOKEN_SECRET = env.jwtSecret;
const REFRESH_TOKEN_SECRET = env.jwtRefreshSecret;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const tokenGenerator = {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  },

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  },

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  },

  getRefreshTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return expiry;
  },
};
