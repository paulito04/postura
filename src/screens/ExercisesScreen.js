import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

const data = [
  "Estiramiento de cuello lateral",
  "Puente de glúteos",
  "Plancha abdominal",
  "Gato-vaca en cuatro puntos",
  "Apertura de pecho en pared",
];

export default function ExercisesScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Text style={[styles.title, { color: colors.textPrimary }]}>{item}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>3 series · 12 repeticiones · 30" de descanso</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
});
