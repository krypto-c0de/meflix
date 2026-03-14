import { Router } from "express";
import { createPixPayment, getPaymentStatus } from "../controllers/payment.controller.js";

const router = Router();

router.post("/series/:id/pix", createPixPayment);
router.get("/series/:id/status", getPaymentStatus);

export default router;
