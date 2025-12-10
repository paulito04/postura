import React, { useMemo } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

const data = [
  "Estiramiento de cuello lateral",
  "Puente de glúteos",
  "Plancha abdominal",
  "Gato-vaca en cuatro puntos",
  "Apertura de pecho en pared",
];

export default function ExercisesScreen({ tabParams }) {
  const { colors } = useAppTheme();
  const challenge = tabParams?.challenge;

  const exercises = useMemo(() => {
    const merged = [...data];

    if (challenge?.title) {
      if (!merged.includes(challenge.title)) {
        merged.unshift(challenge.title);
      } else {
        merged.sort((a, b) => {
          if (a === challenge.title) return -1;
          if (b === challenge.title) return 1;
          return 0;
        });
      }
    }

    return merged;
  }, [challenge]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={styles.list}
        data={exercises}
        keyExtractor={(item) => item}
        ListHeaderComponent={
          challenge ? (
            <View style={[styles.challengeBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.bannerEyebrow, { color: colors.primaryDark }]}>Desafío del día</Text>
              <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>{challenge.title}</Text>
              <Text style={[styles.bannerDescription, { color: colors.textSecondary }]}>{challenge.description}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{item}</Text>
              {challenge?.title === item ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>Destacado</Text>
                </View>
              ) : null}
            </View>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  challengeBanner: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
  },
  bannerEyebrow: {
    fontSize: 13,
    fontWeight: "800",
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  bannerDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
