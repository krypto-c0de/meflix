import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient colors={["#190305", "#0b0b0b"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mobile first</Text>
          </View>

          <Text style={styles.title}>Sua vida como série de streaming.</Text>
          <Text style={styles.subtitle}>
            Meflix foi reorganizado para mobile: quiz, preview, checkout PIX e
            resultado prontos para um fluxo vertical e compartilhável.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Loop viral do produto</Text>
            <Text style={styles.cardBody}>
              Faz a sua série, posta no TikTok, amigos comentam, entram no app,
              pagam barato e repetem o ciclo.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fluxo do app</Text>
            <Text style={styles.cardBody}>Quiz → Prévia → PIX → Resultado → Compartilhar</Text>
          </View>

          <Link href="/quiz" style={styles.primaryButton}>
            Começar meu teste
          </Link>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 18,
    justifyContent: "center",
    flexGrow: 1,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(229,9,20,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#ff8f96",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
  },
  title: {
    color: "#fff",
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    color: "#c8c8c8",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardBody: {
    color: "#c8c8c8",
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#e50914",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 16,
  },
});
