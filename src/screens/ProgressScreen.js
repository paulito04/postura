import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

export default function ProgressScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.title, { color: colors.textPrimary }]}>Progreso semanal</Text>
        <View style={styles.row}>
          <View style={[styles.metric, { backgroundColor: colors.background }]}> 
            <Text style={[styles.metricValue, { color: colors.primary }]}>5/7</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Días activos</Text>
          </View>
          <View style={[styles.metric, { backgroundColor: colors.background }]}> 
            <Text style={[styles.metricValue, { color: colors.wellness }]}>28</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Ejercicios</Text>
          </View>
        </View>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>Sigue entrenando para mantener una racha saludable.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  helper: {
    fontSize: 14,
  },
});
