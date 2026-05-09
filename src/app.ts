import express from "express";
import cors from "cors";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";
import helmet from "helmet";
import * as Sentry from "@sentry/node";
import { errorMiddleware } from "./shared/middlewares/error.middleware";

export const app = express();

// ─── Importer les strategies pour les enregistrer ────────────────────────────
import "./infrastructure/oauth/google.strategy";
import "./infrastructure/oauth/facebook.strategy";
import router from "./routes";
import { healthCheck } from "./infrastructure/monitoring/health";

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1", router);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", healthCheck);

// ─── Sentry Error Handler ────────────────────────────
Sentry.setupExpressErrorHandler(app);

// ─── Error Handler ─────────────────────────────────────
app.use(errorMiddleware);
