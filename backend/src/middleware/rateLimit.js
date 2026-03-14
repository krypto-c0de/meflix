import { rateLimit as expressRateLimit } from "express-rate-limit";

export const rateLimit = expressRateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em instantes." },
});
