import { Router } from "express";
import { handleAbacatePayWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/abacatepay", handleAbacatePayWebhook);

export default router;
