import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../themeContext";
import { ExercisesListParams } from "./ExercisesListScreen";

const cardImages = {
  correction: require("../../assets/logo.jpg"),
  stretch: require("../../assets/logo.jpg"),
  favorites: require("../../assets/logo.jpg"),
};

type ExercisesHomeScreenProps = {
  navigation?: { navigate?: (screen: string, params?: ExercisesListParams) => void };
};

export default function ExercisesHomeScreen({ navigation }: ExercisesHomeScreenProps) {
  const { colors } = useAppTheme();

  const cards: { key: ExercisesListParams["mode"]; title: string; subtitle: string; image: any }[] = [
    {
      key: "correction",
      title: "Corrección de postura",
      subtitle: "Rutinas para alinear y fortalecer tu postura",
      image: cardImages.correction,
    },
    {
      key: "all",
      title: "Estiramientos",
      subtitle: "Estiramientos guiados para cuello, espalda y hombros",
      image: cardImages.stretch,
    },
    {
      key: "favorites",
      title: "Mis estiramientos",
      subtitle: "Tus ejercicios favoritos guardados",
      image: cardImages.favorites,
    },
  ];

  const handlePress = (mode: ExercisesListParams["mode"]) => {
    navigation?.navigate?.("ExercisesList", { mode });
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>Elige tu tipo de sesión</Text>

      {cards.map((card) => (
        <TouchableOpacity
          key={card.key}
          style={[styles.card, { backgroundColor: colors.surface }]}
          activeOpacity={0.9}
          onPress={() => handlePress(card.key)}
        >
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{card.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{card.subtitle}</Text>
          </View>
          <View style={styles.cardImageWrapper}>
            <Image source={card.image} style={styles.cardImage} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  cardImageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
