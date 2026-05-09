import cron from "node-cron";
import { logger } from "../logger/logger";

export function startKeepAliveCron() {
  const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;

  if (!appUrl) {
    logger.warn("Keep-alive cron disabled — APP_URL not set");
    return;
  }

  cron.schedule("*/14 * * * *", async () => {
    try {
      const response = await fetch(`${appUrl}/health`);

      if (response.ok) {
        logger.info(`Keep-alive ping OK — ${appUrl}/health`);
      } else {
        logger.warn(`Keep-alive ping failed — status ${response.status}`);
      }
    } catch (error) {
      logger.error("Keep-alive ping error", { error });
    }
  });

  logger.info(`Keep-alive cron started — pinging ${appUrl}/health every 14min`);
}
