import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { getSeriesPreview } from "../../src/services/seriesApi";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

  async function handleShare() {
    if (!data?.result) return;

    await Share.share({
      message: `${data.result.title}\n${data.result.tagline}\n\n${data.result.synopsis}`,
    });
  }

  if (!loading && data && !data.isPaid) {
    router.replace({ pathname: "/checkout/[id]", params: { id } });
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{data?.result?.title || "Resultado completo"}</Text>
      <Text style={styles.tagline}>{data?.result?.tagline || "Carregando..."}</Text>
      {loading ? <Text style={styles.muted}>Carregando resultado...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data?.result ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sinopse</Text>
            <Text style={styles.cardText}>{data.result.synopsis}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Elenco</Text>
            {data.result.cast.map((item) => (
              <Text key={`${item.actor}-${item.role}`} style={styles.cardText}>
                {item.actor} como {item.role}
              </Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Episódios</Text>
            {data.result.episodes.map((episode) => (
              <Text key={episode.title} style={styles.cardText}>
                {episode.title}: {episode.summary}
              </Text>
            ))}
          </View>

          <Pressable style={styles.primaryButton} onPress={handleShare}>
            <Text style={styles.primaryButtonText}>Compartilhar resultado</Text>
          </Pressable>
        </>
      ) : null}
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
