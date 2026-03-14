import { useNavigate } from "react-router-dom";
import { OnboardingQuiz } from "../components/OnboardingQuiz";
import { useSeriesPreview } from "../hooks/useSeriesPreview";

export function QuizPage() {
  const navigate = useNavigate();
  const { loading, error, generate } = useSeriesPreview();

  async function handleSubmit(respostas) {
    const payload = {
      name: respostas.nome,
      ageRange: respostas.idade,
      genre: respostas.genero,
      tone: respostas.tom,
      vibe: respostas.vibe,
      chaos: respostas.caos || "Não informado",
      dreamCast: "",
    };

    const result = await generate(payload);

    if (result?.id) {
      navigate(`/preview/${result.id}`, { state: result });
    }
  }

  return (
    <main className="quiz-page">
      <OnboardingQuiz onSubmit={handleSubmit} loading={loading} error={error} />
    </main>
  );
}
