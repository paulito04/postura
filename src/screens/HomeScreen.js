import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "../themeContext";

export default function HomeScreen({ navigation, userName }) {
  const { colors } = useAppTheme();
  const [sittingMinutes, setSittingMinutes] = useState(135);

  const palette = useMemo(
    () => ({
      deepBlue: "#1D2A62",
      calmBlue: "#87A6CE",
      beige: "#F5F3D8",
      pistachio: "#AFD06E",
      pine: "#437118",
    }),
    []
  );

  const handleExercisesPress = () => {
    if (navigation?.navigate) {
      navigation.navigate("Ejercicios");
    }
  };

  const greeting = userName ? `¡Hola, ${userName}!` : "¡Hola!";

  const handleLogBreak = () => {
    setSittingMinutes((prev) => Math.max(prev - 10, 0));
  };

  const tips = useMemo(
    () => [
      "Mantén los pies apoyados completamente en el suelo.",
      "Ajusta la altura de la pantalla para que tus ojos queden al nivel.",
      "Levántate y estira cada 60 minutos para activar la circulación.",
    ],
    []
  );

  const reminders = useMemo(
    () => [
      { time: "10:30", label: "Pausa activa de 5 minutos" },
      { time: "12:00", label: "Estiramientos cervicales" },
      { time: "15:00", label: "Caminar 10 minutos" },
    ],
    []
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.calmBlue }]}>
      <StatusBar style="dark" />
      <View style={styles.headerArea}>
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <HomeIcon />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.greeting, { color: palette.deepBlue }]}>{greeting}</Text>
            <Text style={[styles.subGreeting, { color: palette.deepBlue }]}>Tu bienestar postural empieza aquí</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.quickStartButton, { backgroundColor: palette.pistachio }]}
          onPress={handleExercisesPress}
        >
          <Text style={[styles.quickStartText, { color: palette.deepBlue }]}>Inicio rápido de rutina</Text>
          <Text style={[styles.quickStartSub, { color: palette.deepBlue }]}>3 min de movilidad guiada</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.surface, { backgroundColor: palette.beige }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsColumn}>
            <View style={[styles.card, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTitle, { color: palette.deepBlue }]}>Desafío del día</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Ejercicio recomendado para hoy</Text>
                </View>
                <View style={styles.challengeIcon}>
                  <View style={styles.challengeHead} />
                  <View style={styles.challengeArms} />
                  <View style={styles.challengeLegs} />
                </View>
              </View>
              <View style={styles.badgeRow}>
                <Text style={[styles.badge, { backgroundColor: palette.calmBlue, color: palette.deepBlue }]}>Ejercicio del día</Text>
              </View>
              <Text style={[styles.cardBody, { color: palette.deepBlue }]}>Elevaciones de hombros x 12 repeticiones · 3 series</Text>
              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: palette.deepBlue }]}
                onPress={handleExercisesPress}
              >
                <Text style={[styles.secondaryButtonText, { color: palette.beige }]}>Comenzar ahora</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: palette.deepBlue }]}>Objetivo semanal</Text>
                <Text style={[styles.goalText, { color: colors.textSecondary }]}>3 de 5 sesiones</Text>
              </View>
              <View style={styles.goalRow}>
                <View style={[styles.progressCircle, { borderColor: palette.deepBlue }]}>
                  <View style={[styles.progressInner, { backgroundColor: palette.calmBlue }]} />
                </View>
                <View style={styles.goalDetails}>
                  <Text style={[styles.goalLabel, { color: palette.deepBlue }]}>Sesiones completadas</Text>
                  <Text style={[styles.goalValue, { color: palette.deepBlue }]}>3 de 5 esta semana</Text>
                  <Text style={[styles.goalHint, { color: colors.textSecondary }]}>Estás a 2 sesiones de lograrlo</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: palette.deepBlue }]}>Recordatorios próximos</Text>
                <Text style={[styles.cardLink, { color: palette.deepBlue }]}>Ver agenda</Text>
              </View>
              <View style={styles.remindersList}>
                {reminders.map((item) => (
                  <View key={item.time} style={styles.reminderItem}>
                    <Text style={[styles.reminderTime, { color: palette.deepBlue }]}>{item.time}</Text>
                    <Text style={[styles.reminderLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: palette.deepBlue }]}>Tips ergonómicos</Text>
                <Text style={[styles.cardLink, { color: palette.deepBlue }]}>Ver todos</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                {tips.map((tip, index) => (
                  <View
                    key={tip}
                    style={[styles.tipCard, { backgroundColor: index % 2 === 0 ? palette.calmBlue : palette.pistachio }]}
                  >
                    <Text style={[styles.tipText, { color: palette.deepBlue }]}>{tip}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={[styles.card, styles.shadow, { backgroundColor: "#FFFFFF" }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: palette.deepBlue }]}>Tiempo sentado hoy</Text>
                <Text style={[styles.cardLink, { color: palette.deepBlue }]}>Objetivo 6h</Text>
              </View>
              <View style={styles.sittingRow}>
                <View style={styles.sittingCounter}>
                  <Text style={[styles.sittingValue, { color: palette.deepBlue }]}>{Math.floor(sittingMinutes / 60)}h</Text>
                  <Text style={[styles.sittingValue, { color: palette.deepBlue }]}>{sittingMinutes % 60}m</Text>
                </View>
                <View style={styles.sittingDetails}>
                  <Text style={[styles.sittingLabel, { color: colors.textSecondary }]}>Registrado hoy</Text>
                  <Text style={[styles.sittingHint, { color: palette.deepBlue }]}>Toma una pausa corta para reducir la tensión.</Text>
                  <TouchableOpacity
                    style={[styles.breakButton, { backgroundColor: palette.pine }]}
                    onPress={handleLogBreak}
                  >
                    <Text style={[styles.breakButtonText, { color: palette.beige }]}>Registrar pausa -10min</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F5F3D8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTextGroup: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
  },
  subGreeting: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickStartButton: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickStartText: {
    fontSize: 16,
    fontWeight: "800",
  },
  quickStartSub: {
    fontSize: 12,
    fontWeight: "700",
  },
  surface: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  scrollContent: {
    paddingBottom: 28,
    gap: 16,
  },
  cardsColumn: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: "800",
    fontSize: 12,
  },
  cardBody: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "800",
    fontSize: 15,
  },
  challengeIcon: {
    width: 46,
    height: 46,
    backgroundColor: "#87A6CE",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  challengeHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1D2A62",
  },
  challengeArms: {
    position: "absolute",
    top: 18,
    width: 32,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#1D2A62",
  },
  challengeLegs: {
    position: "absolute",
    bottom: 8,
    width: 22,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#1D2A62",
    transform: [{ rotate: "20deg" }],
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  goalDetails: {
    flex: 1,
    gap: 4,
  },
  goalText: {
    fontWeight: "700",
  },
  goalLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  goalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  goalHint: {
    fontSize: 13,
    fontWeight: "600",
  },
  remindersList: {
    gap: 10,
  },
  reminderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  reminderTime: {
    fontSize: 15,
    fontWeight: "800",
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardLink: {
    fontSize: 13,
    fontWeight: "800",
  },
  carousel: {
    gap: 12,
    paddingVertical: 6,
  },
  tipCard: {
    width: 220,
    borderRadius: 14,
    padding: 12,
  },
  tipText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  sittingRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  sittingCounter: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#F5F3D8",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  sittingValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  sittingDetails: {
    flex: 1,
    gap: 6,
  },
  sittingLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  sittingHint: {
    fontSize: 14,
    fontWeight: "700",
  },
  breakButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  breakButtonText: {
    fontWeight: "800",
  },
});

function HomeIcon() {
  return (
    <View style={homeIconStyles.wrapper}>
      <View style={homeIconStyles.houseBase}>
        <View style={homeIconStyles.door} />
        <View style={homeIconStyles.window} />
      </View>
      <View style={homeIconStyles.roof} />
    </View>
  );
}

const homeIconStyles = StyleSheet.create({
  wrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#437118",
    alignItems: "center",
    justifyContent: "center",
  },
  houseBase: {
    position: "absolute",
    bottom: 6,
    width: 24,
    height: 16,
    backgroundColor: "#F5F3D8",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  door: {
    width: 8,
    height: 10,
    backgroundColor: "#437118",
    borderRadius: 2,
    marginBottom: 2,
  },
  window: {
    position: "absolute",
    right: 4,
    top: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#437118",
  },
  roof: {
    position: "absolute",
    top: 7,
    width: 20,
    height: 20,
    backgroundColor: "#F5F3D8",
    transform: [{ rotate: "45deg" }],
    borderRadius: 4,
  },
});
