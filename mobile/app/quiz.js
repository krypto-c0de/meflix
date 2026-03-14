import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createSeriesPreview } from "../src/services/seriesApi";

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

export default function QuizScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    nome: "",
    idade: "",
    genero: "",
    tom: "",
    vibe: "",
    caos: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  const current = QUESTIONS[step];
  const isSummary = step === QUESTIONS.length;
  const progress = useMemo(() => (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100, [step]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    slideAnim.setValue(24);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, fadeAnim, slideAnim]);

  useEffect(() => {
    if (current?.type === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [current]);

  function updateAnswer(key, value) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [key]: value }));
  }

  function goBack() {
    if (step === 0 || loading) return;
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  async function gerarSerie(respostas) {
    const payload = {
      name: respostas.nome,
      ageRange: respostas.idade,
      genre: respostas.genero,
      tone: respostas.tom,
      vibe: respostas.vibe,
      chaos: respostas.caos || "Não informado",
      dreamCast: "",
    };

    setLoading(true);
    setError("");

    try {
      const result = await createSeriesPreview(payload);
      router.push({
        pathname: "/preview/[id]",
        params: { id: result.id, payload: JSON.stringify(result) },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function goNext() {
    if (loading) return;

    if (isSummary) {
      await gerarSerie(answers);
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, QUESTIONS.length));
  }

  function skipOptional() {
    if (!current || current.required || loading) return;
    setStep((currentStep) => Math.min(currentStep + 1, QUESTIONS.length));
  }

  const currentValue = current ? answers[current.key] : "";
  const canContinue = isSummary
    ? true
    : current.required
      ? String(currentValue || "").trim().length > 0
      : true;

  function renderQuestion() {
    if (isSummary) {
      return (
        <View style={styles.questionWrap}>
          <Text style={styles.kicker}>Resumo</Text>
          <Text style={styles.title}>Tudo certo para gerar sua série</Text>
          <Text style={styles.subtitle}>
            Revise suas respostas e continue quando estiver pronto.
          </Text>

          <View style={styles.summaryCard}>
            {QUESTIONS.map((question) => (
              <View key={question.key} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{question.question}</Text>
                <Text style={styles.summaryValue}>
                  {String(answers[question.key] || "").trim() || "Não informado"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.questionWrap}>
        <Text style={styles.kicker}>
          Pergunta {step + 1} de {QUESTIONS.length}
        </Text>
        <Text style={styles.title}>{current.question}</Text>
        <Text style={styles.subtitle}>{current.required ? "Responda para continuar" : "Opcional"}</Text>

        {current.type === "input" ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={answers[current.key]}
            onChangeText={(value) => updateAnswer(current.key, value)}
            placeholder={current.placeholder}
            placeholderTextColor="#555555"
            returnKeyType="done"
            onSubmitEditing={() => {
              if (!current.required && !String(currentValue || "").trim()) {
                skipOptional();
                return;
              }

              if (canContinue) {
                goNext();
              }
            }}
          />
        ) : (
          <View style={styles.chipsWrap}>
            {current.options.map((option) => {
              const active = answers[current.key] === option;

              return (
                <Pressable
                  key={option}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => updateAnswer(current.key, option)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", default: undefined })}
    >
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.inner}>
        <View style={styles.topRow}>
          <Pressable
            onPress={goBack}
            disabled={step === 0 || loading}
            style={[styles.backButton, (step === 0 || loading) && styles.backButtonDisabled]}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.viewport,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {renderQuestion()}
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.footer}>
          {!isSummary && !current.required ? (
            <Pressable onPress={skipOptional} disabled={loading}>
              <Text style={styles.skipText}>pular →</Text>
            </Pressable>
          ) : (
            <View />
          )}

          <Pressable
            onPress={goNext}
            disabled={!canContinue || loading}
            style={[styles.continueButton, (!canContinue || loading) && styles.continueButtonDisabled]}
          >
            <Text style={styles.continueButtonText}>
              {isSummary ? (loading ? "Gerando..." : "Gerar série →") : "Continuar →"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#E24B4A",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  topRow: {
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonDisabled: {
    opacity: 0.35,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  viewport: {
    flex: 1,
    justifyContent: "center",
  },
  questionWrap: {
    gap: 18,
  },
  kicker: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 38,
    fontWeight: "800",
  },
  subtitle: {
    color: "#555555",
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  chipActive: {
    borderColor: "#E24B4A",
    backgroundColor: "#1f0d0d",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  chipTextActive: {
    color: "#E24B4A",
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  summaryRow: {
    gap: 6,
  },
  summaryLabel: {
    color: "#555555",
    fontSize: 13,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  errorText: {
    color: "#ff9b9b",
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipText: {
    color: "#555555",
    fontSize: 15,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#E24B4A",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
