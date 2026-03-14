import { useState } from "react";
import { createSeriesPreview } from "../services/seriesApi";

export function useSeriesPreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(payload) {
    setLoading(true);
    setError("");

    try {
      return await createSeriesPreview(payload);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, generate };
}
