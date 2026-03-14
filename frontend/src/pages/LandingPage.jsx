import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    num: "01",
    icon: "🎬",
    tag: "Protagonista",
    accent: true,
    wide: true,
    title: "Você no centro da história",
    description:
      "Sua vida vira série com título, sinopse, elenco e episódios com tom cinematográfico. Em poucos minutos, do nada ao catálogo.",
  },
  {
    num: "02",
    icon: "📲",
    title: "Visual que para o scroll",
    description: "Primeiro frame forte e clima de streaming premium. Feito para TikTok e stories.",
  },
  {
    num: "03",
    icon: "🔁",
    title: "Loop de aquisição orgânico",
    description: "Você posta, os amigos comentam, entram no site. O loop se forma sozinho.",
  },
  {
    num: "04",
    icon: "⚡",
    title: "PIX com fricção zero",
    description: "Ticket baixo, resultado imediato. Sem criar conta, sem cadastro, sem atrito.",
  },
];

const testimonials = [
  {
    initials: "IS",
    color: "#7c3aed",
    name: "Iskandão",
    handle: "@iskandao",
    text: "Ficou absurdo. O elenco parecia ter sido escolhido por alguém que me conhece demais.",
  },
  {
    initials: "MC",
    color: "#0891b2",
    name: "Mari Campos",
    handle: "@maricampos",
    text: "Postei nos stories e em 5 minutos já tinham me pedido o link. Viralizou antes de eu sair da cama.",
  },
  {
    initials: "RB",
    color: "#dc2626",
    name: "Rafael B.",
    handle: "@rafaelb",
    text: "Esse tipo de produto viraliza porque todo mundo quer ver a própria versão. Genial.",
  },
  {
    initials: "AN",
    color: "#059669",
    name: "Ana Nunes",
    handle: "@ananunes",
    text: "O mais forte é que dá vontade de discordar do elenco e fazer o seu. Aí você já pagou.",
  },
  {
    initials: "LP",
    color: "#d97706",
    name: "Lucas P.",
    handle: "@lucasp",
    text: "Meu grupo inteiro fez o dele no mesmo dia. Ficamos discutindo os elencos por horas.",
  },
];

const faqs = [
  {
    q: "Quanto tempo leva para gerar?",
    a: "O fluxo foi pensado para ser rápido: quiz em 2 minutos, prévia gerada na hora, desbloqueio imediato via PIX.",
  },
  {
    q: "Preciso criar conta?",
    a: "Não. A proposta é reduzir o atrito ao mínimo. Entra, responde, gera, paga, compartilha.",
  },
  {
    q: "O que vem no resultado completo?",
    a: "Título definitivo, tagline, sinopse completa, elenco total, 3 episódios marcantes com resumo e estrutura pronta para compartilhar.",
  },
  {
    q: "Posso gerar mais de uma vez?",
    a: "Sim. Cada geração é uma nova série. Muita gente faz pra si e depois testa pra amigos também.",
  },
];

function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = React.useState(Boolean(defaultOpen));

  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen((value) => !value)}>
      <div className="faq-q">
        <span>{q}</span>
        <div className="faq-icon">{open ? "−" : "+"}</div>
      </div>
      {open ? <p className="faq-a">{a}</p> : null}
    </div>
  );
}

export function LandingPage() {
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <main className="landing-page">
      <section className="lp-hero-wrap">
        <div className="lp-hero">
          <div className="lp-hero-left">
            <div className="lp-hero-badge">
              <span className="lp-badge-dot" />
              Feito para viralizar em grupo, casal e amigos
            </div>

            <h1 className="lp-hero-title">
              Sua vida
              <br />
              como <em>série</em>
              <br />
              de streaming.
            </h1>

            <p className="lp-hero-sub">
              Responde o quiz, a IA gera título, elenco, sinopse e episódios. Veja a prévia de
              graça - desbloqueie o resultado completo por R$ 4,90.
            </p>

            <div className="lp-hero-actions">
              <Link to="/quiz" className="btn-primary">
                Fazer a minha →
              </Link>
              <a href="#como-funciona" className="btn-ghost">
                Como funciona
              </a>
            </div>

            <div className="lp-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">2min</span>
                <span className="lp-stat-label">do quiz ao resultado</span>
              </div>
              <div className="lp-stat">
                <span className="lp-stat-num">R$4,90</span>
                <span className="lp-stat-label">acesso completo</span>
              </div>
              <div className="lp-stat">
                <span className="lp-stat-num">100%</span>
                <span className="lp-stat-label">gerado por IA</span>
              </div>
            </div>
          </div>

          <div className="lp-hero-right">
            <div className="lp-preview-card">
              <div className="lp-preview-header">
                <div className="lp-preview-tag">● Preview gerado</div>
                <div className="lp-preview-title">Iskandão: Temporada de Decisões Duvidosas</div>
                <div className="lp-preview-sub">Drama romântico · 8 episódios · 4.9 ★</div>
              </div>

              <div className="lp-preview-body">
                <div className="lp-preview-row">
                  <div className="lp-preview-row-label">Elenco principal</div>
                  <div className="lp-preview-row-val">
                    Wagner Moura, Bruna Marquezine, Sophie Charlotte
                  </div>
                </div>

                <div className="lp-preview-row">
                  <div className="lp-preview-row-label">Trecho da sinopse</div>
                  <div className="lp-preview-row-val">
                    Um homem que achava que tinha a vida sob controle até o universo resolver...
                  </div>
                </div>

                <div className="lp-preview-row locked">
                  <div className="lp-preview-row-label">🔒 Episódios completos</div>
                  <div className="lp-preview-row-val">Bloqueado até o PIX</div>
                </div>
              </div>

              <div className="lp-preview-footer">
                <div className="lp-preview-price">
                  <span>R$</span>4,90
                </div>
                <Link to="/quiz" className="btn-unlock-sm">
                  Desbloquear →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="container">
          <span className="section-kicker">Por que funciona</span>
          <h2 className="lp-section-title">Identidade pessoal com cara de catálogo premium.</h2>
          <p className="lp-section-sub">
            O valor não está só na IA. Está na mistura de protagonismo, visual reconhecível e
            vontade de compartilhar.
          </p>

          <div className="lp-bento">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`lp-bento-card ${feature.accent ? "accent" : ""} ${feature.wide ? "wide" : ""}`}
              >
                <span className="lp-bento-num">{feature.num}</span>
                <div className={`lp-bento-icon ${feature.accent ? "red" : "dim"}`}>
                  {feature.icon}
                </div>
                {feature.tag ? <div className="lp-bento-tag">● {feature.tag}</div> : null}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-tinted" id="como-funciona">
        <div className="container">
          <span className="section-kicker">Como funciona</span>
          <h2 className="lp-section-title">Três passos. Dois minutos. Uma série.</h2>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-circle">1</div>
              <div>
                <h3>Responda o quiz</h3>
                <p>Poucas perguntas sobre tom, caos e vibe da sua temporada. Rápido e direto.</p>
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-step-circle lp-step-circle--active">2</div>
              <div>
                <h3>Veja a prévia</h3>
                <p>Título, elenco e sinopse parcial gerados na hora. Suficiente pra gerar desejo.</p>
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-step-circle">3</div>
              <div>
                <h3>Desbloqueie e poste</h3>
                <p>Resultado completo por R$ 4,90 via PIX. Compartilhe e observe o loop.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <span className="section-kicker">Reações reais</span>
          <h2 className="lp-section-title">O tipo de comentário que puxa o próximo.</h2>
        </div>

        <div className="lp-testimonials-wrap">
          <div className="lp-testimonials-track">
            {allTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.handle}-${index}`} className="lp-tcard">
                <div className="lp-tcard-head">
                  <div className="lp-tcard-avatar" style={{ background: testimonial.color }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="lp-tcard-name">{testimonial.name}</div>
                    <div className="lp-tcard-handle">{testimonial.handle}</div>
                  </div>
                  <div className="lp-tcard-stars">★★★★★</div>
                </div>
                <p>"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="container">
          <div className="lp-faq-grid">
            <div className="lp-faq-sticky">
              <span className="section-kicker">FAQ</span>
              <h2 className="lp-section-title">Dúvidas antes do primeiro teste.</h2>
              <p className="lp-section-sub" style={{ marginTop: 12 }}>
                Se ainda tiver alguma, é só gerar e ver.
              </p>
              <Link to="/quiz" className="btn-primary" style={{ width: "fit-content", marginTop: 8 }}>
                Fazer a minha →
              </Link>
            </div>

            <div className="lp-faq-list">
              {faqs.map((item, index) => (
                <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="lp-final-cta">
        <span className="section-kicker">Pronto?</span>
        <h2>Descubra qual série o algoritmo faria sobre você.</h2>
        <p>Começa pela prévia grátis. Se ficar bom - e vai ficar - desbloqueie e poste.</p>
        <div className="lp-hero-actions">
          <Link to="/quiz" className="btn-primary">
            Gerar minha série →
          </Link>
          <a href="#como-funciona" className="btn-ghost">
            Ver como funciona
          </a>
        </div>
      </div>

      <footer className="lp-footer">
        <span className="brand">
          <span className="brand-me">me</span>
          <span className="brand-flix">.flix</span>
        </span>
        <p>Feito para viralizar. © 2026</p>
      </footer>
    </main>
  );
}
