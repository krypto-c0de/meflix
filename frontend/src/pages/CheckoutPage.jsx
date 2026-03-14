import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPixPayment, getPaymentStatus } from "../services/paymentApi";
import { getSeriesPreview } from "../services/seriesApi";

export function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payer, setPayer] = useState({
    customerName: "",
    customerEmail: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await getSeriesPreview(id);
        if (!cancelled) setSeries(response);
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

  useEffect(() => {
    if (!payment) return undefined;

    const interval = window.setInterval(async () => {
      try {
        const [seriesResponse, paymentResponse] = await Promise.all([
          getSeriesPreview(id),
          getPaymentStatus(id),
        ]);

        setSeries(seriesResponse);
        setPayment(paymentResponse.payment);

        if (seriesResponse.isPaid) {
          window.clearInterval(interval);
          navigate(`/resultado/${id}`);
        }
      } catch {
        // polling best effort
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [id, navigate, payment]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await createPixPayment(id, payer);
      setPayment(response.payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyCode() {
    if (!payment?.brCode) return;
    await navigator.clipboard.writeText(payment.brCode);
  }

  return (
    <main className="page">
      <section className="panel stack mobile-panel">
        <span className="eyebrow">Checkout {id}</span>
        <h2>Pagamento PIX do resultado completo</h2>
        <p>Faça o PIX e a liberação acontece automaticamente assim que o webhook confirmar o pagamento.</p>

        <div className="card stack">
          <h3>Oferta inicial</h3>
          <p>
            Desbloqueie sinopse completa, elenco total e episódios marcantes por R${" "}
            {((series?.priceCents || 490) / 100).toFixed(2).replace(".", ",")}.
          </p>
        </div>

        {loading ? <p className="muted">Carregando checkout...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome do pagador</label>
            <input
              value={payer.customerName}
              onChange={(event) => setPayer((current) => ({ ...current, customerName: event.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label>E-mail do pagador</label>
            <input
              type="email"
              value={payer.customerEmail}
              onChange={(event) => setPayer((current) => ({ ...current, customerEmail: event.target.value }))}
              required
            />
          </div>

          <div className="button-row mobile-sticky-actions">
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? "Gerando PIX..." : "Gerar PIX"}
            </button>
            <Link to={`/preview/${id}`} className="button-secondary">
              Voltar para preview
            </Link>
          </div>
        </form>

        {payment ? (
          <div className="card stack">
            <h3>PIX pronto</h3>
            <p>Status atual: {payment.status}</p>
            <img
              className="pix-qr"
              src={
                payment.brCodeBase64?.startsWith("data:image")
                  ? payment.brCodeBase64
                  : `data:image/png;base64,${payment.brCodeBase64}`
              }
              alt="QR Code PIX"
            />
            <textarea className="pix-code" readOnly value={payment.brCode} rows={4} />
            <div className="button-row mobile-sticky-actions">
              <button type="button" className="button-secondary" onClick={handleCopyCode}>
                Copiar código PIX
              </button>
              <Link to={`/resultado/${id}`} className="button-secondary">
                Tentar abrir resultado
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
