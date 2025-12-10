import React, { useEffect, useMemo } from "react";
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FavoritesButton from "../components/learning/FavoritesButton";

export default function LearningDetailScreen({ item, onBack, onToggleFavorite, onMarkRead }) {
  const keyPoints = useMemo(
    () => [
      "Aplica cambios pequeños de forma constante",
      "Configura recordatorios de pausas activas",
      "Escucha a tu cuerpo: dolor es señal de ajuste",
      "Combina ergonomía con hábitos de movimiento",
    ],
    []
  );

  useEffect(() => {
    if (item?.id) {
      onMarkRead?.(item.id);
    }
  }, [item?.id, onMarkRead]);

  const handleShare = async () => {
    try {
      await Share.share({
        title: item.title,
        message: `${item.title} - ${item.content}`,
      });
    } catch (error) {
      console.warn("Error al compartir", error);
    }
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="Volver">
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.section}>{item.section}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{`${item.readTime} • ${item.level}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Imagen ilustrativa</Text>
        </View>

        <Text style={styles.paragraph}>{item.content}</Text>

        <Text style={styles.subheading}>Puntos clave</Text>
        {keyPoints.map((point) => (
          <View key={point} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}

        <Text style={styles.subheading}>Consejos prácticos</Text>
        <View style={styles.tipsBox}>
          <Text style={styles.tipText}>✔ Ajusta tu espacio cada vez que cambies de tarea.</Text>
          <Text style={styles.tipText}>✔ Realiza pausas activas de 2 minutos cada 45.</Text>
          <Text style={styles.tipText}>✔ Si sientes tensión, respira profundo y reacomoda tu postura.</Text>
        </View>

        <View style={styles.actions}>
          <FavoritesButton isActive={item.favorite} onPress={onToggleFavorite} />
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareIcon}>📤</Text>
            <Text style={styles.shareText}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 20,
    backgroundColor: "#EFF6FF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  backIcon: {
    fontSize: 18,
    color: "#1F2937",
  },
  section: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  placeholderImage: {
    backgroundColor: "#DBEAFE",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#1D4ED8",
    fontWeight: "700",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1F2937",
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    color: "#3B82F6",
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  tipsBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 20,
  },
  tipText: {
    fontSize: 14,
    color: "#1F2937",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  shareIcon: {
    fontSize: 18,
  },
  shareText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D4ED8",
  },
});
