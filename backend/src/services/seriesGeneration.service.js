import { badRequest } from "../lib/errors.js";
import { buildSeriesPrompt } from "./promptBuilder.service.js";
import { generateJson } from "./gemini.service.js";
import { createSeriesGeneration, getSeriesGenerationById } from "../repositories/series.repository.js";
import { env } from "../config/env.js";

function trimText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateSeriesInput(input) {
  const requiredTextFields = [
    ["name", input.name],
    ["ageRange", input.ageRange],
    ["genre", input.genre],
    ["tone", input.tone],
    ["vibe", input.vibe],
    ["chaos", input.chaos],
  ];

  const invalidField = requiredTextFields.find(([, value]) => trimText(value).length < 2);

  if (invalidField) {
    throw badRequest(`Campo inválido: ${invalidField[0]}.`);
  }
}

function buildPreviewSynopsis(synopsis) {
  const normalized = trimText(synopsis);
  if (normalized.length <= 220) return normalized;
  return `${normalized.slice(0, 220).trimEnd()}...`;
}

function serializeSeries(series) {
  const previewCast = Array.isArray(series.cast) ? series.cast.slice(0, 2) : [];
  const previewEpisodes = Array.isArray(series.episodes) ? series.episodes.slice(0, 1) : [];

  return {
    id: series.id,
    priceCents: env.resultPriceCents,
    isPaid: Boolean(series.isPaid),
    preview: {
      title: series.title,
      tagline: series.tagline,
      synopsis: series.previewSynopsis,
      cast: previewCast,
      episodes: previewEpisodes,
    },
    result: series.isPaid
      ? {
          title: series.title,
          tagline: series.tagline,
          synopsis: series.synopsis,
          cast: series.cast,
          episodes: series.episodes,
          posterPrompt: series.posterPrompt,
        }
      : null,
  };
}

export async function generateSeriesPreview(input) {
  validateSeriesInput(input);

  const prompt = buildSeriesPrompt(input);
  const generation = await generateJson(prompt);

  const record = await createSeriesGeneration({
    ...input,
    title: trimText(generation.title),
    tagline: trimText(generation.tagline),
    synopsis: trimText(generation.synopsis),
    previewSynopsis: buildPreviewSynopsis(generation.synopsis),
    cast: Array.isArray(generation.cast) ? generation.cast.slice(0, 4) : [],
    episodes: Array.isArray(generation.episodes) ? generation.episodes.slice(0, 3) : [],
    posterPrompt: trimText(generation.posterPrompt),
  });

  return serializeSeries(record);
}

export async function getSeriesForClient(id) {
  const series = await getSeriesGenerationById(id);
  if (!series) return null;
  return serializeSeries(series);
}
