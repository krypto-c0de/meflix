import { getSupabase } from "../db/supabase.js";

function mapRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    ageRange: row.age_range,
    genre: row.genre,
    tone: row.tone,
    vibe: row.vibe,
    chaos: row.chaos,
    dreamCast: row.dream_cast,
    title: row.title,
    tagline: row.tagline,
    synopsis: row.synopsis,
    previewSynopsis: row.preview_synopsis,
    cast: row.cast_json || [],
    episodes: row.episodes_json || [],
    posterPrompt: row.poster_prompt,
    isPaid: row.is_paid,
    createdAt: row.created_at,
  };
}

export async function createSeriesGeneration(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("series_generations")
    .insert({
      name: payload.name,
      age_range: payload.ageRange,
      genre: payload.genre,
      tone: payload.tone,
      vibe: payload.vibe,
      chaos: payload.chaos,
      dream_cast: payload.dreamCast,
      title: payload.title,
      tagline: payload.tagline,
      synopsis: payload.synopsis,
      preview_synopsis: payload.previewSynopsis,
      cast_json: payload.cast,
      episodes_json: payload.episodes,
      poster_prompt: payload.posterPrompt,
      is_paid: false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function getSeriesGenerationById(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("series_generations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return mapRow(data);
}

export async function markSeriesAsPaid(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("series_generations")
    .update({ is_paid: true })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}
