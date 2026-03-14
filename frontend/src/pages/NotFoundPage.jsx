import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page">
      <section className="panel stack">
        <span className="eyebrow">404</span>
        <h2>Página não encontrada</h2>
        <p>Essa rota ainda não existe no funil do produto.</p>
        <div className="button-row">
          <Link to="/" className="button">
            Voltar para home
          </Link>
        </div>
      </section>
    </main>
  );
}
