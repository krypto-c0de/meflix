import { env } from "../config/env.js";
import { badRequest } from "../lib/errors.js";
import { verifyWebhookSignature } from "./abacate.service.js";
import { hasProcessedProviderEvent, createProviderEvent } from "../repositories/provider-event.repository.js";
import { markSeriesAsPaid } from "../repositories/series.repository.js";
import { updatePaymentStatusByProviderId } from "../repositories/payment.repository.js";

export async function processAbacatePayWebhook({ rawBody, signature, webhookSecret }) {
  if (!Buffer.isBuffer(rawBody)) {
    throw badRequest("Payload inválido.");
  }

  if (webhookSecret !== env.abacatePayWebhookSecret) {
    throw badRequest("Webhook secret inválido.");
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    throw badRequest("Assinatura do webhook inválida.");
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const providerEventId = `${payload.event}:${payload.data?.transparent?.id || "unknown"}`;

  if (await hasProcessedProviderEvent(providerEventId)) {
    return { ok: true, duplicate: true };
  }

  const event = payload.event;
  const transparent = payload.data?.transparent;
  const seriesId = transparent?.externalId;

  await createProviderEvent({
    provider: "abacatepay",
    providerEventId,
    eventType: event,
    rawPayload: payload,
  });

  if (transparent?.id) {
    await updatePaymentStatusByProviderId(transparent.id, {
      status: transparent.status,
      rawPayload: payload,
    });
  }

  if (event === "transparent.completed" && seriesId) {
    await markSeriesAsPaid(seriesId);
  }

  return { ok: true };
}
