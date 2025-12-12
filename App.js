import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MainTabs from "./src/navigation/MainTabs";
import IntroScreen from "./src/screens/IntroScreen";
import { AppStateProvider, useAppState } from "./src/context/AppStateContext";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import LoginModal from "./src/components/LoginModal";
import { NotificationProvider } from "./src/NotificationManager";
import { PointsProvider } from "./src/PointsManager";
import { UserProvider, useUser } from "./src/UserContext";

function LoadingScreen() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <SafeAreaView style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.text }]}>Cargando…</Text>
    </SafeAreaView>
  );
}

function AuthScreen({ onContinue }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const hasEmailFlow = email.trim().length > 0 || password.trim().length > 0;

  const handleContinue = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Elige un nombre de usuario para personalizar tu app");
      return;
    }

    if (hasEmailFlow && (!email.trim() || !password.trim())) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    setError("");
    onContinue({ name: trimmedName, email: email.trim() });
  }, [email, hasEmailFlow, name, onContinue, password]);

  const handleGoogleLogin = useCallback(() => {
    const fallbackName = name || "Usuario Google";
    setName(fallbackName);
    setEmail(email || "usuario@gmail.com");
    setError("");
    onContinue({ name: fallbackName, email: email || "usuario@gmail.com" });
  }, [email, name, onContinue]);

  return (
    <SafeAreaView style={[styles.registrationContainer, { backgroundColor: colors.background }]}>
      <View style={styles.registrationContent}>
        <View style={styles.authHeader}>
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>Bienvenido</Text>
          <Text style={[styles.registrationTitle, { color: colors.primary }]}>Crea tu cuenta o inicia sesión</Text>
          <Text style={[styles.registrationSubtitle, { color: colors.textMuted }]}>Guarda tu racha y personaliza tu saludo.</Text>
        </View>

        <TouchableOpacity
          style={[styles.googleButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleIcon}>ⓖ</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.googleTitle, { color: colors.text }]}>Continuar con Google</Text>
            <Text style={[styles.googleSubtitle, { color: colors.textMuted }]}>Usaremos tu nombre o puedes editarlo</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerLabel, { color: colors.textMuted }]}>o con correo y contraseña</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Nombre de usuario</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Cómo quieres que te saludemos"
            placeholderTextColor={colors.textMuted}
            style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            />
          </View>
        </View>

        {error ? <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text> : null}

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleContinue}>
          <Text style={[styles.primaryButtonText, { color: colors.text }]}>Empezar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function RootApp({ user, setUser, isLoggedIn, setIsLoggedIn, handleLogin, userHydrated }) {
  const { hydrated: appHydrated } = useAppState();
  const [showIntro, setShowIntro] = useState(true);

  const handleFinishIntro = useCallback(() => setShowIntro(false), []);

  const displayName = useMemo(
    () => user?.username || user?.name || "Usuario",
    [user?.name, user?.username]
  );

  if (!appHydrated || !userHydrated) {
    return <LoadingScreen />;
  }

  return showIntro ? (
    <IntroScreen onFinish={handleFinishIntro} />
  ) : (
    <MainTabs
      user={user}
      userName={displayName}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      setUser={setUser}
      onLogin={handleLogin}
      LoginCardComponent={LoginModal}
    />
  );
}

function RootAppContainer() {
  const { user, setUser, hydrated: userHydrated } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(user));
  }, [user]);

  const handleLogin = useCallback(
    ({ username, name, email }) => {
      const trimmedName = name?.trim() || username?.trim() || "Usuario";
      const generatedEmail = email?.trim() || `${trimmedName}@posturau.app`;

      setUser({
        ...(user || {}),
        username: username?.trim() || undefined,
        name: trimmedName,
        email: generatedEmail,
      });
      setIsLoggedIn(true);
    },
    [setUser, user]
  );

  return (
    <RootApp
      user={user}
      setUser={setUser}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      handleLogin={handleLogin}
      userHydrated={userHydrated}
    />
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <PointsProvider>
        <ThemeProvider>
          <UserProvider>
            <AppStateProvider>
              <RootAppContainer />
            </AppStateProvider>
          </UserProvider>
        </ThemeProvider>
      </PointsProvider>
    </NotificationProvider>
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
    fontWeight: "700",
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
  authHeader: {
    gap: 6,
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  registrationTitle: {
    fontSize: 26,
    fontWeight: "800",
  },
  registrationSubtitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  errorText: {
    fontWeight: "700",
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    alignSelf: "center",
  },
  primaryButtonText: {
    fontWeight: "800",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  googleSubtitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  loggedInRow: {
    gap: 10,
  },
  loggedInText: {
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
