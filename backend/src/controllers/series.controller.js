import { generateSeriesPreview, getSeriesForClient } from "../services/seriesGeneration.service.js";
import { notFound } from "../lib/errors.js";
import { sendError } from "../lib/response.js";

export async function createSeriesPreview(req, res) {
  try {
    const result = await generateSeriesPreview(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getSeriesPreview(req, res) {
  try {
    const result = await getSeriesForClient(req.params.id);
    if (!result) throw notFound("Série não encontrada.");
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
