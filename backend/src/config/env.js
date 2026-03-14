import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 3000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  abacatePayApiKey: process.env.ABACATEPAY_API_KEY || "",
  abacatePayPublicKey: process.env.ABACATEPAY_PUBLIC_KEY || "",
  abacatePayWebhookSecret: process.env.ABACATEPAY_WEBHOOK_SECRET || "",
  resultPriceCents: Number(process.env.RESULT_PRICE_CENTS || 490),
};

export function requireEnvVars(names) {
  const missing = names.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    const error = new Error(`Variáveis ausentes: ${missing.join(", ")}.`);
    error.status = 500;
    throw error;
  }
}
