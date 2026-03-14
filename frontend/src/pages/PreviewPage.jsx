import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getSeriesPreview } from "../services/seriesApi";

export function PreviewPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(state || null);
  const [loading, setLoading] = useState(!state);
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

  if (!id) {
    navigate("/quiz");
    return null;
  }

  return (
    <main className="page">
      <section className="panel stack mobile-panel">
        <span className="eyebrow">Preview {id}</span>
        <h2>{data?.preview?.title || "Carregando sua série..."}</h2>
        <p>{data?.preview?.tagline || "Estamos montando o seu catálogo."}</p>
        {loading ? <p className="muted">Carregando preview...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <div className="card stack">
          <h3>Elenco principal</h3>
          {data?.preview?.cast?.length ? (
            data.preview.cast.map((item) => (
              <p key={`${item.actor}-${item.role}`}>
                <strong>{item.actor}</strong> como {item.role}
              </p>
            ))
          ) : (
            <p>Seu elenco aparece aqui assim que a geração termina.</p>
          )}
        </div>

        <div className="card stack">
          <h3>Trecho desbloqueado da sinopse</h3>
          <p>{data?.preview?.synopsis || "A prévia da sinopse aparece aqui."}</p>
        </div>

        <div className="card stack locked-card">
          <h3>Bloqueado até o PIX</h3>
          <p>Sinopse completa, 3 episódios marcantes e elenco total são liberados após o pagamento.</p>
        </div>

        <div className="button-row mobile-sticky-actions">
          <Link to={`/checkout/${id}`} className="button">
            Desbloquear por R$ {((data?.priceCents || 490) / 100).toFixed(2).replace(".", ",")}
          </Link>
        </div>
      </section>
    </main>
  );
}
