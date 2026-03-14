import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { rateLimit } from "./middleware/rateLimit.js";
import healthRoutes from "./routes/health.routes.js";
import seriesRoutes from "./routes/series.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.frontendUrl,
  })
);

app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
app.use(rateLimit);

app.use("/health", healthRoutes);
app.use("/series", seriesRoutes);
app.use("/payments", paymentRoutes);

export default app;
