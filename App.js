import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function App() {
  const handlePress = () => {
    console.log("Ver ejercicios de postura");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuida tu postura</Text>
      <Text style={styles.subtitle}>
        Pequeños cambios, gran diferencia para tu espalda.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Ver ejercicios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f4f4",
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#4a90e2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
