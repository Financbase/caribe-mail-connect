/* eslint-env node */
/**
 * Rate limiting middleware for CEMI Core API within PRMCE.
 * Ensures rural accessibility by preventing abuse under low-bandwidth conditions.
 * @date 2025-02-14
 */
import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10),
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiRateLimiter;
