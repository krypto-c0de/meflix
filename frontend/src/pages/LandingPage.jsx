import { Link } from "react-router-dom";

const features = [
  {
    title: "Você é o protagonista",
    description: "Sua vida vira série com título, sinopse, elenco, episódios e tom cinematográfico em poucos minutos.",
  },
  {
    title: "Visual reconhecível na hora",
    description: "Primeiro frame forte, contraste alto e clima de catálogo premium para parar o scroll no TikTok.",
  },
  {
    title: "Feito para compartilhar",
    description: "A pessoa gera, posta, os amigos comentam ‘faz o meu’ e o loop de aquisição se forma sozinho.",
  },
  {
    title: "Desbloqueio simples por PIX",
    description: "Prévia grátis para curiosidade. Resultado completo liberado por ticket baixo e impulso social.",
  },
];

const testimonials = [
  "“Ficou absurdo. O elenco parecia ter sido escolhido por alguém que me conhece demais.”",
  "“Postei nos stories e em 5 minutos já tinham me pedido o link.”",
  "“Esse tipo de produto viraliza porque todo mundo quer ver a própria versão.”",
  "“O mais forte é que dá vontade de discordar do elenco e fazer o seu.”",
];

const faqs = [
  {
    q: "Quanto tempo leva para gerar?",
    a: "O fluxo foi pensado para ser rápido: responder, gerar a prévia e decidir se quer desbloquear o resultado completo.",
  },
  {
    q: "Preciso criar conta?",
    a: "Não no MVP. A proposta é reduzir atrito e ir direto para o resultado.",
  },
  {
    q: "O que vem no resultado completo?",
    a: "Título, tagline, sinopse final, elenco, episódios marcantes e estrutura pronta para compartilhar.",
  },
  {
    q: "É só brincadeira ou dá para monetizar?",
    a: "A lógica do produto é justamente unir entretenimento viral com cobrança leve por geração.",
  },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="container hero-content">
          <div className="hero-badge">
            <div className="avatar-stack">
              <span />
              <span />
              <span />
            </div>
            <span>feito para viralizar em grupo, casal e amigos</span>
          </div>

          <h1>Sua vida como série de streaming em 2 minutos.</h1>
          <p className="hero-sub">
            Descubra título, elenco, sinopse e episódios da sua própria série. Gere a prévia, desbloqueie o resultado e poste.
          </p>

          <div className="hero-actions">
            <Link to="/quiz" className="btn-primary">
              Fazer a minha
            </Link>
            <a href="#examples" className="btn-ghost">
              Ver exemplos
            </a>
          </div>

          <div id="examples" className="hero-showcase">
            <article className="showcase-card spotlight">
              <span className="showcase-tag">Nova série</span>
              <h3>Iskandão: Temporada de Decisões Duvidosas</h3>
              <p>
                Um drama pop sobre caos profissional, romance mal resolvido e energia de protagonista que não pede licença.
              </p>
              <div className="showcase-meta">
                <span>Drama romântico</span>
                <span>4.9</span>
              </div>
            </article>

            <article className="showcase-card">
              <span className="showcase-tag subtle">Elenco</span>
              <p>Wagner Moura, Bruna Marquezine, Sophie Charlotte e uma participação que todo mundo vai marcar.</p>
            </article>

            <article className="showcase-card">
              <span className="showcase-tag subtle">Loop viral</span>
              <p>Faz o seu. Posta. O grupo comenta. Entram no site. Pagam. Compartilham. Repete.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container section-header">
          <span className="section-kicker">Por que funciona</span>
          <h2>Produto de identidade pessoal com cara de catálogo premium.</h2>
          <p>
            O valor não está só na IA. Está na mistura de protagonismo, visual reconhecível e vontade de compartilhar.
          </p>
        </div>

        <div className="container features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="container section-header">
          <span className="section-kicker">Como funciona</span>
          <h2>Curto, visual e feito para celular.</h2>
        </div>

        <div className="container steps-grid">
          <article className="step-card">
            <strong>1</strong>
            <h3>Responda o quiz</h3>
            <p>Poucas perguntas para capturar o tom, o caos e a vibe da sua temporada.</p>
          </article>
          <article className="step-card">
            <strong>2</strong>
            <h3>Veja a prévia</h3>
            <p>Título, elenco inicial e sinopse parcial suficientes para gerar desejo.</p>
          </article>
          <article className="step-card">
            <strong>3</strong>
            <h3>Desbloqueie por PIX</h3>
            <p>Resultado completo liberado com ticket baixo e fricção mínima.</p>
          </article>
        </div>
      </section>

      <section className="landing-section overflow-hidden">
        <div className="container section-header">
          <span className="section-kicker">Social proof</span>
          <h2>O tipo de reação que puxa o próximo usuário.</h2>
        </div>

        <div className="testimonials-wrap">
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((item, index) => (
              <article key={`${item}-${index}`} className="testimonial-card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container faq-shell">
          <div className="section-header left">
            <span className="section-kicker">FAQ</span>
            <h2>Perguntas rápidas antes do primeiro teste.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <article key={item.q} className="faq-item">
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span>+</span>
                </div>
                <p className="faq-answer">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section final-cta">
        <div className="container final-cta-card">
          <span className="section-kicker">Pronto para testar?</span>
          <h2>Descubra qual série o algoritmo faria sobre você.</h2>
          <p>Comece pela prévia. Se ficar bom, desbloqueie e compartilhe.</p>
          <div className="hero-actions">
            <Link to="/quiz" className="btn-primary">
              Gerar minha série
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
