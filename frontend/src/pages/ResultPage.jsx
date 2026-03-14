import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSeriesPreview } from "../services/seriesApi";

export function ResultPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await getSeriesPreview(id);
        if (!cancelled) setData(response);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="page">
      <section className="panel stack mobile-panel">
        <span className="eyebrow">Resultado {id}</span>
        <h2>{data?.result?.title || "Resultado completo"}</h2>
        {loading ? <p className="muted">Carregando resultado...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading && data && !data.isPaid ? (
          <div className="card stack">
            <h3>Ainda bloqueado</h3>
            <p>O resultado completo só aparece depois da confirmação do PIX.</p>
            <div className="button-row mobile-sticky-actions">
              <Link to={`/checkout/${id}`} className="button">
                Ir para checkout
              </Link>
              <Link to={`/preview/${id}`} className="button-secondary">
                Ver preview
              </Link>
            </div>
          </div>
        ) : null}

        {data?.isPaid && data?.result ? (
          <>
            <p>{data.result.tagline}</p>
            <div className="card stack">
              <h3>Sinopse completa</h3>
              <p>{data.result.synopsis}</p>
            </div>

            <div className="grid grid-3">
              <article className="card stack">
                <h3>Elenco</h3>
                {data.result.cast.map((item) => (
                  <p key={`${item.actor}-${item.role}`}>
                    <strong>{item.actor}</strong> como {item.role}
                  </p>
                ))}
              </article>

              <article className="card stack">
                <h3>Episódios</h3>
                {data.result.episodes.map((episode) => (
                  <p key={episode.title}>
                    <strong>{episode.title}</strong>: {episode.summary}
                  </p>
                ))}
              </article>

              <article className="card stack">
                <h3>Compartilhar</h3>
                <p>Poster prompt: {data.result.posterPrompt}</p>
                <p>Próxima etapa opcional: gerar imagem final para download.</p>
              </article>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
