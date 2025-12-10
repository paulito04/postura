import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MainTabs from "./src/navigation/MainTabs";
import IntroScreen from "./src/screens/IntroScreen";
import { AppStateProvider, useAppState } from "./src/context/AppStateContext";
import { ThemeProvider, useAppTheme } from "./src/themeContext";

export function LoginCard({ user, onLogin }) {
  const { colors } = useAppTheme();
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    setNameInput(user?.name ?? "");
    setEmailInput(user?.email ?? "");
    setPasswordInput("");
  }, [user?.email, user?.name]);

  const handleLogin = () => {
    const trimmedName = nameInput.trim();
    const trimmedEmail = emailInput.trim();
    if (!trimmedName || !trimmedEmail) return;

    onLogin({ name: trimmedName, email: trimmedEmail });
  };

  return (
    <View style={[styles.loginCard, { backgroundColor: "#FFFFFF", borderColor: colors.border }]}>
      <Text style={[styles.loginTitle, { color: "#055F67" }]}>Iniciar sesión</Text>

      <View style={styles.loginInputGroup}>
        <Text style={[styles.loginLabel, { color: colors.textSecondary }]}>Nombre</Text>
        <TextInput
          placeholder="Ingresa tu nombre"
          placeholderTextColor={colors.textSecondary}
          value={nameInput}
          onChangeText={setNameInput}
          style={[styles.loginInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: "#F6F7FB" }]}
        />
      </View>
      <View style={styles.loginInputGroup}>
        <Text style={[styles.loginLabel, { color: colors.textSecondary }]}>Correo</Text>
        <TextInput
          placeholder="tu@email.com"
          placeholderTextColor={colors.textSecondary}
          value={emailInput}
          onChangeText={setEmailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.loginInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: "#F6F7FB" }]}
        />
      </View>
      <View style={styles.loginInputGroup}>
        <Text style={[styles.loginLabel, { color: colors.textSecondary }]}>Contraseña</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={passwordInput}
          onChangeText={setPasswordInput}
          style={[styles.loginInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: "#F6F7FB" }]}
        />
      </View>

      <TouchableOpacity style={[styles.loginButton, { backgroundColor: "#0F9BA8" }]} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoadingScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Cargando…</Text>
    </SafeAreaView>
  );
}

function AuthScreen({ onContinue }) {
  const { colors } = useAppTheme();
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
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>Bienvenido</Text>
          <Text style={[styles.registrationTitle, { color: colors.primaryDark }]}>Crea tu cuenta o inicia sesión</Text>
          <Text style={[styles.registrationSubtitle, { color: colors.textSecondary }]}>Guarda tu racha y personaliza tu saludo.</Text>
        </View>

        <TouchableOpacity style={[styles.googleButton, { borderColor: colors.border }]} onPress={handleGoogleLogin}>
          <Text style={styles.googleIcon}>ⓖ</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.googleTitle, { color: colors.textPrimary }]}>Continuar con Google</Text>
            <Text style={[styles.googleSubtitle, { color: colors.textSecondary }]}>Usaremos tu nombre o puedes editarlo</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerLabel, { color: colors.textSecondary }]}>o con correo y contraseña</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre de usuario</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Cómo quieres que te saludemos"
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.textInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={[styles.textInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            />
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Empezar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function RootApp({ user, setUser, isLoggedIn, setIsLoggedIn, handleLogin }) {
  const { hydrated } = useAppState();
  const [showIntro, setShowIntro] = useState(true);

  const handleFinishIntro = useCallback(() => setShowIntro(false), []);

  const displayName = useMemo(() => user?.name || "", [user?.name]);

  if (!hydrated) {
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
      LoginCardComponent={LoginCard}
    />
  );
}

export default function App() {
  const [user, setUser] = useState({ name: "Jean", email: "jean@posturau.app" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = ({ name, email }) => {
    setUser({ name, email });
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider>
      <AppStateProvider>
        <RootApp
          user={user}
          setUser={setUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          handleLogin={handleLogin}
        />
      </AppStateProvider>
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
    color: "#d9534f",
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
    color: "#0B1D26",
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
    backgroundColor: "#FFFFFF",
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
  loginCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    },
  loginTitle: {
    fontSize: 22,
    fontWeight: "800",
    },
  loginInputGroup: {
    gap: 6,
  },
  loginLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  loginInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
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
