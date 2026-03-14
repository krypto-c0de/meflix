import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { createPixPayment, getPaymentStatus } from "../../src/services/paymentApi";
import { getSeriesPreview } from "../../src/services/seriesApi";

function getQrSource(brCodeBase64) {
  if (!brCodeBase64) return null;
  return brCodeBase64.startsWith("data:image")
    ? { uri: brCodeBase64 }
    : { uri: `data:image/png;base64,${brCodeBase64}` };
}

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const [series, setSeries] = useState(null);
  const [payment, setPayment] = useState(null);
  const [payer, setPayer] = useState({ customerName: "", customerEmail: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

    const interval = setInterval(async () => {
      try {
        const [seriesResponse, paymentResponse] = await Promise.all([
          getSeriesPreview(id),
          getPaymentStatus(id),
        ]);

        setSeries(seriesResponse);
        setPayment(paymentResponse.payment);

        if (seriesResponse.isPaid) {
          clearInterval(interval);
          router.replace({ pathname: "/result/[id]", params: { id } });
        }
      } catch {
        // best effort
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, payment]);

  async function handleGeneratePix() {
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

  async function handleSharePix() {
    if (!payment?.brCode) return;
    await Share.share({
      message: `PIX meflix\n\n${payment.brCode}`,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Desbloquear resultado completo</Text>
      <Text style={styles.subtitle}>
        Pagamento simples por PIX. O app libera automaticamente assim que a confirmação chegar.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Oferta</Text>
        <Text style={styles.cardText}>
          Resultado completo por R$ {((series?.priceCents || 490) / 100).toFixed(2).replace(".", ",")}
        </Text>
      </View>

      {loading ? <Text style={styles.muted}>Carregando checkout...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.field}>
        <Text style={styles.label}>Nome do pagador</Text>
        <TextInput
          style={styles.input}
          value={payer.customerName}
          onChangeText={(value) => setPayer((current) => ({ ...current, customerName: value }))}
          placeholder="Seu nome"
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>E-mail do pagador</Text>
        <TextInput
          style={styles.input}
          value={payer.customerEmail}
          onChangeText={(value) => setPayer((current) => ({ ...current, customerEmail: value }))}
          placeholder="voce@exemplo.com"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={handleGeneratePix} disabled={submitting}>
        <Text style={styles.primaryButtonText}>{submitting ? "Gerando PIX..." : "Gerar PIX"}</Text>
      </Pressable>

      {payment ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PIX pronto</Text>
          <Text style={styles.cardText}>Status: {payment.status}</Text>
          {getQrSource(payment.brCodeBase64) ? <Image source={getQrSource(payment.brCodeBase64)} style={styles.qr} /> : null}
          <Text style={styles.code}>{payment.brCode}</Text>
          <Pressable style={styles.secondaryButton} onPress={handleSharePix}>
            <Text style={styles.secondaryButtonText}>Compartilhar código PIX</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 32, fontWeight: "800" },
  subtitle: { color: "#c8c8c8", fontSize: 15, lineHeight: 22 },
  muted: { color: "#9d9d9d" },
  error: { color: "#ff9da2" },
  field: { gap: 8 },
  label: { color: "#fff", fontWeight: "600" },
  input: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    gap: 12,
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
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#fff", fontWeight: "700" },
  qr: {
    width: 240,
    height: 240,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  code: { color: "#d0d0d0", lineHeight: 22 },
});
