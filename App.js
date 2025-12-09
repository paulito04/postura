import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function App() {
  const [showExercises, setShowExercises] = useState(false);

  const exercises = [
    "Estiramiento de cuello lateral",
    "Puente de glúteos",
    "Plancha abdominal",
    "Gato-vaca en cuatro puntos",
    "Apertura de pecho en pared",
  ];

  const handlePress = () => {
    setShowExercises(true);
  };

  const handleBack = () => {
    setShowExercises(false);
  };

  return (
    <View style={styles.container}>
      {showExercises ? (
        <View style={styles.card}>
          <Text style={styles.title}>Ejercicios de postura</Text>
          {exercises.map((exercise) => (
            <Text key={exercise} style={styles.listItem}>
              • {exercise}
            </Text>
          ))}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
            <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Cuida tu postura</Text>
          <Text style={styles.subtitle}>
            Pequeños cambios, gran diferencia para tu espalda.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Ver ejercicios</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#4a90e2",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a90e2",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "bold",
  },
});
