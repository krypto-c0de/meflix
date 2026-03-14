import { getSupabase } from "../db/supabase.js";

function mapRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    seriesGenerationId: row.series_generation_id,
    provider: row.provider,
    providerPaymentId: row.provider_payment_id,
    amountCents: row.amount_cents,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    brCode: row.br_code,
    brCodeBase64: row.br_code_base64,
    expiresAt: row.expires_at,
    rawPayload: row.raw_payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getLatestPaymentBySeriesId(seriesGenerationId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("series_generation_id", seriesGenerationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return mapRow(data);
}

export async function createPayment(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      series_generation_id: payload.seriesGenerationId,
      provider: "abacatepay",
      provider_payment_id: payload.providerPaymentId,
      amount_cents: payload.amountCents,
      status: payload.status,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      br_code: payload.brCode,
      br_code_base64: payload.brCodeBase64,
      expires_at: payload.expiresAt,
      raw_payload: payload.rawPayload,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updatePaymentStatusByProviderId(providerPaymentId, updates) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .update({
      status: updates.status,
      raw_payload: updates.rawPayload,
      updated_at: new Date().toISOString(),
    })
    .eq("provider_payment_id", providerPaymentId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return mapRow(data);
}
