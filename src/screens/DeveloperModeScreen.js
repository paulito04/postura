import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { getProgressSnapshot, resetProgress, setProgressOverrides } from "../utils/progressStorage";

export default function DeveloperModeScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [showForm, setShowForm] = useState(false);
  const [streakValue, setStreakValue] = useState("0");
  const [totalTimeValue, setTotalTimeValue] = useState("0");
  const [avgTimeValue, setAvgTimeValue] = useState("0");

  useEffect(() => {
    (async () => {
      const snapshot = await getProgressSnapshot();
      const { stats } = snapshot;
      setStreakValue(String(stats?.currentStreak ?? 0));
      setTotalTimeValue(String(stats?.totalMinutes ?? 0));
      setAvgTimeValue(String(stats?.avgDailyTime ?? 0));
    })();
  }, []);

  const handleReset = () => {
    Alert.alert("¿Seguro? Esto reinicia tu progreso.", "", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Reiniciar",
        style: "destructive",
        onPress: async () => {
          await resetProgress();
          setStreakValue("0");
          setTotalTimeValue("0");
          setAvgTimeValue("0");
          setShowForm(false);
        },
      },
    ]);
  };

  const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };

  const handleSaveOverrides = async () => {
    const streak = parseNumber(streakValue);
    const total = parseNumber(totalTimeValue);
    const avg = parseNumber(avgTimeValue);

    if (streak === null || total === null || avg === null) {
      Alert.alert("Valores inválidos", "Ingresa solo números válidos, sin negativos.");
      return;
    }

    await setProgressOverrides({ streakDays: streak, totalTime: total, avgDailyTime: avg });
    setShowForm(false);
  };

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Modo desarrollador</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Herramientas internas para pruebas de progreso.</Text>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleReset}>
            <Text style={styles.primaryButtonText}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={handleToggleForm}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Cambiar</Text>
          </TouchableOpacity>

          {showForm && (
            <View style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.text }]}>streakDays</Text>
                <TextInput
                  keyboardType="numeric"
                  value={streakValue}
                  onChangeText={setStreakValue}
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.text }]}>totalTime</Text>
                <TextInput
                  keyboardType="numeric"
                  value={totalTimeValue}
                  onChangeText={setTotalTimeValue}
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={[styles.label, { color: colors.text }]}>avgDailyTime</Text>
                <TextInput
                  keyboardType="numeric"
                  value={avgTimeValue}
                  onChangeText={setAvgTimeValue}
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleSaveOverrides}>
                  <Text style={styles.primaryButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: { fontWeight: "800", fontSize: 14 },
  formContainer: { marginTop: 12, gap: 12 },
  formField: { gap: 6 },
  label: { fontSize: 14, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 14 },
  formActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 12 },
});
