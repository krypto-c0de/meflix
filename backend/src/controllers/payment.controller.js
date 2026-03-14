import { sendError } from "../lib/response.js";
import { createSeriesPixPayment, getSeriesPaymentStatus } from "../services/payment.service.js";
import { notFound } from "../lib/errors.js";

export async function createPixPayment(req, res) {
  try {
    const payment = await createSeriesPixPayment(req.params.id, req.body);
    return res.status(201).json({ payment });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getPaymentStatus(req, res) {
  try {
    const payment = await getSeriesPaymentStatus(req.params.id);
    if (!payment) throw notFound("Pagamento não encontrado.");
    return res.json({ payment });
  } catch (error) {
    return sendError(res, error);
  }
}
