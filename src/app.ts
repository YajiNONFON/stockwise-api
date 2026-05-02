import express from "express";
import cors from "cors";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";
import helmet from "helmet";
import { errorMiddleware } from "./shared/middlewares/error.middleware";

export const app = express();

// ─── Importer les strategies pour les enregistrer ────────────────────────────
import "./infrastructure/oauth/google.strategy";
import "./infrastructure/oauth/facebook.strategy";
import router from "./routes";

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

// ─── Swagger UI ───────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1", router);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handler (toujours en dernier) ─────────────────────────────────────
app.use(errorMiddleware);
