import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useAppTheme } from "./src/themeContext";
import IntroScreen from "./src/screens/IntroScreen";
import MainTabs from "./src/navigation/MainTabs";

function LoadingScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.text }]}>Cargando…</Text>
    </SafeAreaView>
  );
}

function RegistrationScreen({ onContinue }) {
  const { colors } = useAppTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinue = useCallback(async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    setError("");
    await onContinue(trimmedName, email.trim());
  }, [email, name, onContinue]);

  return (
    <SafeAreaView style={[styles.registrationContainer, { backgroundColor: colors.background }]}>
      <View style={styles.registrationContent}>
        <Text style={[styles.registrationTitle, { color: colors.primaryDark }]}>Crea tu perfil</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Correo (opcional)</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [userName, setUserName] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const handleFinishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleCompleteRegistration = useCallback(async (name, email) => {
    try {
      await AsyncStorage.setItem("userName", name);
      if (email) {
        await AsyncStorage.setItem("userEmail", email);
      }
    } catch (error) {
      console.error("Error al guardar el perfil", error);
    } finally {
      setUserName(name);
      setHasProfile(true);
    }
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error al cargar el perfil", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <ThemeProvider>
      {loadingProfile ? (
        <LoadingScreen />
      ) : showIntro ? (
        <IntroScreen onFinish={handleFinishIntro} />
      ) : !hasProfile ? (
        <RegistrationScreen onContinue={handleCompleteRegistration} />
      ) : (
        <MainTabs userName={userName} />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  registrationContainer: {
    flex: 1,
    padding: 24,
  },
  registrationContent: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  registrationTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#d9534f",
    fontWeight: "600",
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    alignSelf: "center",
  },
  primaryButtonText: {
    color: "#0B1D26",
    fontWeight: "700",
    fontSize: 16,
  },
});
