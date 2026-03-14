import crypto from "node:crypto";
import { env, requireEnvVars } from "../config/env.js";

const V2_API_URL = "https://api.abacatepay.com/v2";

function getHeaders() {
  return {
    Authorization: `Bearer ${env.abacatePayApiKey}`,
    "Content-Type": "application/json",
  };
}

async function parseJsonResponse(response) {
  const payload = await response.json();

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.error || payload?.message || "Erro ao comunicar com a AbacatePay.");
    error.status = 502;
    throw error;
  }

  return payload.data;
}

export async function createPixQrCode({ amountCents, externalId, customerName, customerEmail }) {
  requireEnvVars(["ABACATEPAY_API_KEY"]);

  const response = await fetch(`${V2_API_URL}/transparents/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      method: "PIX",
      data: {
        amount: amountCents,
        description: "Desbloqueio do resultado completo do meflix",
        expiresIn: 3600,
        customer: {
          name: customerName,
          email: customerEmail,
        },
        metadata: {
          externalId,
          seriesGenerationId: externalId,
        },
      },
    }),
  });

  return parseJsonResponse(response);
}

export function verifyWebhookSignature(rawBody, signature) {
  requireEnvVars(["ABACATEPAY_PUBLIC_KEY"]);

  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", env.abacatePayPublicKey)
    .update(Buffer.from(rawBody))
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
