import { env } from "./shared/config/env"; // dotenv chargé ici en premier
import { app } from "./app";
import { prisma } from "./infrastructure/database/prisma.cloud";
import { logger } from "./infrastructure/logger/logger";

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL connected successfully");
    console.log("⏰ App is ok");
    app.listen(env.port, () => {
      logger.info(`Server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();
