import { sendError } from "../lib/response.js";
import { processAbacatePayWebhook } from "../services/webhook.service.js";

export async function handleAbacatePayWebhook(req, res) {
  try {
    const result = await processAbacatePayWebhook({
      rawBody: req.body,
      signature: req.get("X-Webhook-Signature"),
      webhookSecret: req.query.webhookSecret,
    });

    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
