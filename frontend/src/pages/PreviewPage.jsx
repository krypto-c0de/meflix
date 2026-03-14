import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getSeriesPreview } from "../services/seriesApi";

function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e24b4a" strokeWidth="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconLockBtn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

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

    return () => { cancelled = true; };
  }, [id]);

  if (!id) {
    navigate("/quiz");
    return null;
  }

  const price = ((data?.priceCents || 490) / 100).toFixed(2).replace(".", ",");
  const title = data?.preview?.title || "Carregando sua série...";
  const tagline = data?.preview?.tagline || "Estamos montando o seu catálogo.";
  const synopsis = data?.preview?.synopsis || "";
  const cast = data?.preview?.cast || [];

  return (
    <main className="page preview-page">
      <div className="preview-card mobile-panel">

        <div className="preview-header">
          <div className="preview-badge">
            <span className="preview-badge-dot" />
            Preview demo
          </div>
          <h2 className="preview-title">{title}</h2>
          <p className="preview-tagline">{tagline}</p>
          {error && <p className="preview-error">{error}</p>}
        </div>

        <div className="preview-loading-bar">
          {loading && <div className="preview-loading-shimmer" />}
        </div>

        <div className="preview-sections">

          <div className="preview-section preview-section--unlocked">
            <div className="preview-section-header">
              <div className="preview-section-icon preview-section-icon--green">
                <IconUsers />
              </div>
              <span className="preview-section-title">Elenco principal</span>
            </div>
            <div className="preview-section-body">
              {cast.length > 0 ? (
                cast.map((item) => (
                  <p key={`${item.actor}-${item.role}`} className="preview-section-text">
                    <strong style={{ color: "#e8e8e8" }}>{item.actor}</strong>
                    <span style={{ color: "#555" }}> como </span>
                    {item.role}
                  </p>
                ))
              ) : (
                <p className="preview-section-text">Seu elenco aparece aqui assim que a geração termina.</p>
              )}
            </div>
          </div>

          <div className="preview-section preview-section--partial">
            <div className="preview-section-header">
              <div className="preview-section-icon preview-section-icon--yellow">
                <IconFile />
              </div>
              <span className="preview-section-title">Trecho da sinopse</span>
            </div>
            <div className="preview-section-body">
              {synopsis ? (
                <p className="preview-section-text">
                  {synopsis.slice(0, Math.ceil(synopsis.length * 0.45))}
                  <span className="preview-blur">
                    {synopsis.slice(Math.ceil(synopsis.length * 0.45))}
                  </span>
                </p>
              ) : (
                <p className="preview-section-text">A prévia da sinopse aparece aqui.</p>
              )}
            </div>
          </div>

          <div className="preview-section preview-section--locked">
            <div className="preview-section-header">
              <div className="preview-section-icon preview-section-icon--red">
                <IconLock />
              </div>
              <span className="preview-section-title">Conteúdo bloqueado</span>
              <span className="preview-lock-badge">PIX</span>
            </div>
            <ul className="preview-locked-list">
              <li>Sinopse completa da temporada</li>
              <li>Ep. 1 — primeiro episódio marcante</li>
              <li>Ep. 2 — segundo episódio marcante</li>
              <li>Ep. 3 — terceiro episódio marcante</li>
              <li>Elenco completo + coadjuvantes</li>
            </ul>
          </div>

        </div>

        <div className="preview-footer">
          <div className="preview-divider" />
          <div className="preview-price-row">
            <div className="preview-price-info">
              <span className="preview-price-label">acesso completo</span>
              <div className="preview-price-value">
                <span className="preview-price-currency">R$</span>
                {price}
              </div>
            </div>
            <Link to={`/checkout/${id}`} className="preview-btn-unlock">
              <IconLockBtn />
              Desbloquear via PIX
            </Link>
          </div>
          <div className="preview-guarantee">
            <IconShield />
            Pagamento seguro · Acesso imediato
          </div>
        </div>

      </div>
    </main>
  );
}
