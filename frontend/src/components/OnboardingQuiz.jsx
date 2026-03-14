import { useEffect, useMemo, useRef, useState } from "react";

const QUESTIONS = [
  {
    key: "nome",
    type: "input",
    question: "Qual é o seu nome?",
    placeholder: "Ex.: Iskandão",
    required: true,
  },
  {
    key: "idade",
    type: "chips",
    question: "Qual é a sua faixa etária?",
    options: ["18–24", "25–34", "35–44", "45+"],
    required: true,
  },
  {
    key: "genero",
    type: "chips",
    question: "Qual gênero combina com a sua história?",
    options: ["Drama romântico", "Comédia", "Thriller", "Fantasia", "Suspense"],
    required: true,
  },
  {
    key: "tom",
    type: "chips",
    question: "Qual é o tom da sua série?",
    options: ["Engraçado e caótico", "Sério e intenso", "Nostálgico", "Emocional", "Surreal"],
    required: true,
  },
  {
    key: "vibe",
    type: "chips",
    question: "Qual é a sua vibe?",
    options: [
      "Main character energy",
      "Vilã em construção",
      "Coadjuvante virou protagonista",
      "Antologia do caos",
    ],
    required: true,
  },
  {
    key: "caos",
    type: "input",
    question: "O caos principal da temporada?",
    placeholder: "Ex.: ex que voltou, promoção inesperada...",
    required: false,
  },
];

export function OnboardingQuiz({ onSubmit, loading, error }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({
    nome: "",
    idade: "",
    genero: "",
    tom: "",
    vibe: "",
    caos: "",
  });
  const inputRef = useRef(null);

  const current = QUESTIONS[step];
  const isSummary = step === QUESTIONS.length;
  const progress = useMemo(() => (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100, [step]);
  const currentValue = current ? answers[current.key] : "";
  const canContinue = isSummary
    ? true
    : current.required
      ? String(currentValue || "").trim().length > 0
      : true;

  useEffect(() => {
    if (current?.type === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [current]);

  function updateAnswer(key, value) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function goBack() {
    if (step === 0 || loading) return;
    setDirection(-1);
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  function goNext() {
    if (!canContinue || loading) return;

    if (isSummary) {
      onSubmit(answers);
      return;
    }

    setDirection(1);
    setStep((currentStep) => Math.min(currentStep + 1, QUESTIONS.length));
  }

  function skipOptional() {
    if (!current || current.required || loading) return;
    setDirection(1);
    setStep((currentStep) => Math.min(currentStep + 1, QUESTIONS.length));
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter") return;
    if (current?.type === "input" && event.shiftKey) return;
    event.preventDefault();

    if (!isSummary && !current.required && String(currentValue || "").trim().length === 0) {
      skipOptional();
      return;
    }

    goNext();
  }

  return (
    <section className="quiz-shell" onKeyDown={handleKeyDown}>
      <div className="quiz-progress">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-body">
        <div className="quiz-topbar">
          <button type="button" onClick={goBack} disabled={step === 0 || loading} className="quiz-back">
            ←
          </button>
        </div>

        <div key={step} className={`quiz-screen ${direction > 0 ? "quiz-enter-forward" : "quiz-enter-back"}`}>
          {isSummary ? (
            <div className="quiz-copy">
              <span className="quiz-kicker">Resumo</span>
              <h1>Tudo certo para gerar sua série</h1>
              <p>Revise as respostas antes de montar o resultado final.</p>

              <div className="quiz-summary">
                {QUESTIONS.map((question) => (
                  <div key={question.key} className="quiz-summary-row">
                    <span className="quiz-summary-label">{question.question}</span>
                    <span className="quiz-summary-value">
                      {String(answers[question.key] || "").trim() || "Não informado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-copy">
              <span className="quiz-kicker">
                Pergunta {step + 1} de {QUESTIONS.length}
              </span>
              <h1>{current.question}</h1>
              <p>{current.required ? "Responda para continuar" : "Opcional"}</p>

              {current.type === "input" ? (
                <input
                  ref={inputRef}
                  value={answers[current.key]}
                  onChange={(event) => updateAnswer(current.key, event.target.value)}
                  placeholder={current.placeholder}
                  className="quiz-input"
                />
              ) : (
                <div className="quiz-chips">
                  {current.options.map((option) => {
                    const active = answers[current.key] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateAnswer(current.key, option)}
                        className={`quiz-chip ${active ? "is-active" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="quiz-footer">
          {!isSummary && !current.required ? (
            <button type="button" className="quiz-skip" onClick={skipOptional}>
              pular →
            </button>
          ) : (
            <span />
          )}

          <button type="button" onClick={goNext} disabled={!canContinue || loading} className="quiz-continue">
            {isSummary ? (loading ? "Gerando..." : "Gerar série →") : "Continuar →"}
          </button>
        </div>
      </div>
    </section>
  );
}
