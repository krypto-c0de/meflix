import { getSupabase } from "../db/supabase.js";

export async function hasProcessedProviderEvent(providerEventId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("provider_events")
    .select("id")
    .eq("provider_event_id", providerEventId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function createProviderEvent(payload) {
  const supabase = getSupabase();
  const { error } = await supabase.from("provider_events").insert({
    provider: payload.provider,
    provider_event_id: payload.providerEventId,
    event_type: payload.eventType,
    raw_payload: payload.rawPayload,
    processed_at: new Date().toISOString(),
  });

  if (error) throw error;
}
