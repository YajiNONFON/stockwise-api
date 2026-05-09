import { Request, Response } from "express";
import { prisma } from "../database/prisma.cloud";
import { logger } from "../logger/logger";

// ============================================
// HEALTH CHECK — /health
// Vérifie : serveur + base de données
// Utilisé par UptimeRobot toutes les 5 min
// ============================================

export async function healthCheck(req: Request, res: Response) {
  try {
    // Ping la base de données
    await prisma.$queryRaw`SELECT 1`;

    const response = {
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: "connected",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };

    logger.info("Health check passed");
    res.status(200).json(response);
  } catch (error) {
    logger.error("Health check failed — database unreachable", { error });

    res.status(503).json({
      status: "error",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
}
