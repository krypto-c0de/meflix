import { api } from "./api";

export function createSeriesPreview(payload) {
  return api.post("/series", payload);
}

export function getSeriesPreview(id) {
  return api.get(`/series/${id}`);
}
