import * as Sentry from "@sentry/node";
import { logger } from "../logger/logger";

// ============================================
// SENTRY — Capture d'erreurs en temps réel
// Doit être initialisé AVANT tout le reste
// ============================================

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.warn("SENTRY_DSN not set — Sentry disabled");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",

    // Capture 100% des erreurs, 10% des transactions (perf)
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Ne pas envoyer les erreurs en test
    enabled: process.env.NODE_ENV !== "test",
  });

  logger.info("Sentry initialized");
}
