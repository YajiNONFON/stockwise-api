import { Request, Response, NextFunction } from "express";
import { tokenGenerator } from "../../modules/auth/domain/token-generator";
import { UnauthorizedException } from "../errors/http-errors";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedException("No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedException("No token provided");
  }

  const payload = tokenGenerator.verifyAccessToken(token);
  req.user = payload;
  next();
};
