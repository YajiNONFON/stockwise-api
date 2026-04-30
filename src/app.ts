import express from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
export const app = express();

// ─── Security ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
//app.use("/api/v1", router);

// ─── Health Check ────────────────────────────────────────────────────────────

// ─── Error Handler (toujours en dernier) ─────────────────────────────────────
app.use(errorMiddleware);
