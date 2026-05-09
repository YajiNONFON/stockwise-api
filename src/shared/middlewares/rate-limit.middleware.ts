import rateLimit from "express-rate-limit";

// ============================================
// RATE LIMITING
// 100 request / 15 min / IP
// ============================================

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    status: 429,
    error: "Too many requests — please try again in 15 minutes",
  },

  skipFailedRequests: false,
});
