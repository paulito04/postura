import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "../themeContext";

export default function HomeScreen({ navigation, userName }) {
  const { colors } = useAppTheme();
  const [selectedDuration, setSelectedDuration] = useState(30);

  const palette = useMemo(
    () => ({
      primary: "#055F67",
      deepTeal: "#0A393C",
      accent: "#67917D",
      softAccent: "#9EB998",
      sand: "#EDEDDD",
    }),
    []
  );

  const greeting = userName ? `¡Hola, ${userName}!` : "¡Hola!";
  const durationOptions = [30, 45, 60];

  const handleStartSession = () => {
    navigation?.navigate?.("Ejercicios");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.sand }]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <View style={[styles.headerGradient, { backgroundColor: palette.primary }]}>
            <View style={[styles.gradientOverlay, { backgroundColor: palette.deepTeal }]} />

            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <Text style={[styles.headerEyebrow, { color: palette.softAccent }]}>Tu bienestar postural empieza aquí</Text>
                <TouchableOpacity style={[styles.iconButton, { borderColor: palette.softAccent }]}> 
                  <Text style={[styles.iconButtonText, { color: "#FFFFFF" }]}>🔔</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.headerGreeting, { color: "#FFFFFF" }]}>{greeting}</Text>
              <Text style={[styles.headerSubtitle, { color: palette.softAccent }]}>Programa tu próxima sesión y cuida tu postura</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentArea}>
          <View style={[styles.sessionCard, styles.shadow, { backgroundColor: "#FFFFFF", marginTop: -36 }]}>
            <Text style={[styles.sectionEyebrow, { color: palette.deepTeal }]}>Sesión de estudio</Text>
            <Text style={[styles.sessionTitle, { color: palette.deepTeal }]}>Inicio rápido de rutina</Text>
            <Text style={[styles.sessionSubtitle, { color: colors.textSecondary }]}>Duración de la próxima pausa activa</Text>

            <View style={styles.durationRow}>
              {durationOptions.map((minutes) => {
                const isActive = selectedDuration === minutes;

                return (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.durationButton,
                      isActive
                        ? { backgroundColor: palette.accent, borderColor: palette.accent }
                        : { backgroundColor: palette.sand, borderColor: palette.deepTeal },
                    ]}
                    onPress={() => setSelectedDuration(minutes)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        isActive ? { color: "#FFFFFF" } : { color: palette.deepTeal },
                      ]}
                    >
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: palette.primary }]}
              onPress={handleStartSession}
            >
              <Text style={styles.primaryButtonText}>Comenzar ahora</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.metricsCard, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
            <Text style={[styles.sectionEyebrow, { color: palette.deepTeal }]}>Resumen</Text>
            <View style={styles.metricsRow}>
              <MetricItem label="Racha" value="0 días" palette={palette} />
              <MetricItem label="Hoy" value="0 actividades" palette={palette} />
              <MetricItem label="Molestia" value="0/10" palette={palette} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricItem({ label, value, palette }) {
  return (
    <View style={styles.metricItem}>
      <Text style={[styles.metricLabel, { color: palette.deepTeal }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: palette.accent }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerWrapper: {
    paddingHorizontal: 20,
  },
  headerGradient: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  headerContent: {
    position: "relative",
    gap: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerEyebrow: {
    fontSize: 13,
    fontWeight: "700",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: "800",
  },
  headerGreeting: {
    fontSize: 30,
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  contentArea: {
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 14,
  },
  sessionCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  sessionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "800",
  },
  primaryButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  metricsCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metricItem: {
    flex: 1,
    backgroundColor: "#F8F8F5",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D6D6D1",
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
});
