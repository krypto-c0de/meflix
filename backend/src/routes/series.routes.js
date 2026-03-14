import { Router } from "express";
import { createSeriesPreview, getSeriesPreview } from "../controllers/series.controller.js";

const router = Router();

router.post("/", createSeriesPreview);
router.get("/:id", getSeriesPreview);

export default router;
