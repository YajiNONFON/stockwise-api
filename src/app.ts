import express from "express";
import cors from "cors";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { errorMiddleware } from "./shared/middlewares/error.middleware";

export const app = express();

// ─── Import strategies ────────────────────────────
import "./infrastructure/oauth/google.strategy";
import "./infrastructure/oauth/facebook.strategy";
import router from "./routes";
import { healthCheck } from "./infrastructure/monitoring/health";
import { rateLimitMiddleware } from "./shared/middlewares/rate-limit.middleware";
import { whatsappRouter } from "./modules/whatsapp/whatsapp.routes";

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(rateLimitMiddleware);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ─── Passport ────────────────────────────────────────────────────────────────
app.use(passport.initialize());

app.set("json replacer", (key: string, value: unknown) => {
  if (
    value !== null &&
    typeof value === "object" &&
    value.constructor?.name === "Decimal"
  ) {
    return Number(value);
  }
  return value;
});

// ─── Swagger UI ───────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Webhook  ───────────────────────────────────────────────────────────────
app.use("/webhook/whatsapp", whatsappRouter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1", router);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", healthCheck);

// ─── Sentry Error Handler ────────────────────────────
Sentry.setupExpressErrorHandler(app);

// ─── Error Handler ─────────────────────────────────────
app.use(errorMiddleware);
