import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getSeriesPreview } from "../../src/services/seriesApi";

export default function PreviewScreen() {
  const { id, payload } = useLocalSearchParams();
  const initialData = useMemo(() => {
    if (!payload) return null;
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }, [payload]);

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{data?.preview?.title || "Sua série"}</Text>
      <Text style={styles.tagline}>{data?.preview?.tagline || "Preparando a sua prévia..."}</Text>
      {loading ? <Text style={styles.muted}>Carregando prévia...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sinopse liberada</Text>
        <Text style={styles.cardText}>{data?.preview?.synopsis || "A prévia aparece aqui."}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Elenco principal</Text>
        {data?.preview?.cast?.map((item) => (
          <Text key={`${item.actor}-${item.role}`} style={styles.cardText}>
            {item.actor} como {item.role}
          </Text>
        ))}
      </View>

      <View style={[styles.card, styles.lockedCard]}>
        <Text style={styles.cardTitle}>Bloqueado até o PIX</Text>
        <Text style={styles.cardText}>
          Sinopse completa, elenco inteiro e episódios marcantes são liberados depois do pagamento.
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push({ pathname: "/checkout/[id]", params: { id } })}
      >
        <Text style={styles.primaryButtonText}>
          Desbloquear por R$ {((data?.priceCents || 490) / 100).toFixed(2).replace(".", ",")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 32, fontWeight: "800" },
  tagline: { color: "#ffb7bc", fontSize: 16, lineHeight: 22 },
  muted: { color: "#9d9d9d" },
  error: { color: "#ff9da2" },
  card: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    gap: 10,
  },
  lockedCard: { opacity: 0.88 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cardText: { color: "#d0d0d0", fontSize: 15, lineHeight: 22 },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: "#e50914",
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
