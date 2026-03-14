import { badRequest, notFound } from "../lib/errors.js";
import { env } from "../config/env.js";
import { getSeriesGenerationById } from "../repositories/series.repository.js";
import {
  createPayment,
  getLatestPaymentBySeriesId,
} from "../repositories/payment.repository.js";
import { createPixQrCode } from "./abacate.service.js";

function serializePayment(payment) {
  if (!payment) return null;

  return {
    id: payment.id,
    providerPaymentId: payment.providerPaymentId,
    amountCents: payment.amountCents,
    status: payment.status,
    brCode: payment.brCode,
    brCodeBase64: payment.brCodeBase64,
    expiresAt: payment.expiresAt,
  };
}

export async function createSeriesPixPayment(seriesId, input) {
  if (!input.customerName || input.customerName.trim().length < 2) {
    throw badRequest("Nome do pagador inválido.");
  }

  if (!input.customerEmail || !input.customerEmail.includes("@")) {
    throw badRequest("E-mail do pagador inválido.");
  }

  const series = await getSeriesGenerationById(seriesId);

  if (!series) {
    throw notFound("Série não encontrada.");
  }

  if (series.isPaid) {
    throw badRequest("Essa série já foi desbloqueada.");
  }

  const existing = await getLatestPaymentBySeriesId(seriesId);
  if (existing && existing.status === "PENDING" && new Date(existing.expiresAt) > new Date()) {
    return serializePayment(existing);
  }

  const providerPayment = await createPixQrCode({
    amountCents: env.resultPriceCents,
    externalId: seriesId,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
  });

  const payment = await createPayment({
    seriesGenerationId: seriesId,
    providerPaymentId: providerPayment.id,
    amountCents: providerPayment.amount,
    status: providerPayment.status,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    brCode: providerPayment.brCode,
    brCodeBase64: providerPayment.brCodeBase64,
    expiresAt: providerPayment.expiresAt,
    rawPayload: providerPayment,
  });

  return serializePayment(payment);
}

export async function getSeriesPaymentStatus(seriesId) {
  const payment = await getLatestPaymentBySeriesId(seriesId);
  if (!payment) return null;
  return serializePayment(payment);
}
