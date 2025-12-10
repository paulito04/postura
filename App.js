import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MainTabs from "./src/navigation/MainTabs";
import IntroScreen from "./src/screens/IntroScreen";
import { AppStateProvider, useAppState } from "./src/context/AppStateContext";
import { ThemeProvider, useAppTheme } from "./src/themeContext";

export function LoginCard({ userName, setUserName, isLoggedIn, setIsLoggedIn }) {
  const { colors } = useAppTheme();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setUsernameInput("");
      setPasswordInput("");
    }
  }, [isLoggedIn]);

  const handleLogin = useCallback(() => {
    const trimmed = usernameInput.trim();
    if (!trimmed) return;

    setUserName(trimmed);
    setIsLoggedIn(true);
  }, [setIsLoggedIn, setUserName, usernameInput]);

  const handleChangeUser = useCallback(() => {
    setIsLoggedIn(false);
    setUserName("");
    setUsernameInput("");
    setPasswordInput("");
  }, [setIsLoggedIn, setUserName]);

  return (
    <View style={[styles.loginCard, { backgroundColor: `${colors.surface}F2`, borderColor: colors.border }]}>
      <Text style={[styles.loginTitle, { color: colors.primaryDark }]}>Iniciar sesión</Text>

      {!isLoggedIn ? (
        <>
          <View style={styles.loginInputGroup}>
            <Text style={[styles.loginLabel, { color: colors.textSecondary }]}>Nombre de usuario</Text>
            <TextInput
              placeholder="Ingresa tu nombre"
              placeholderTextColor={colors.textSecondary}
              value={usernameInput}
              onChangeText={setUsernameInput}
              style={[styles.loginInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
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
              style={[styles.loginInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            />
          </View>

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: "#055F67" }]} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loggedInRow}>
          <Text style={[styles.loggedInText, { color: colors.textPrimary }]}>Has iniciado sesión como {userName || "Sin nombre"}</Text>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: "#055F67" }]} onPress={handleChangeUser}>
            <Text style={[styles.secondaryButtonText, { color: "#055F67" }]}>Cambiar usuario</Text>
          </TouchableOpacity>
        </View>
      )}
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

function RootApp({ userName, setUserName, isLoggedIn, setIsLoggedIn }) {
  const { hydrated, userProfile, setUserProfile } = useAppState();
  const [showIntro, setShowIntro] = useState(true);

  const handleFinishIntro = useCallback(() => setShowIntro(false), []);

  const handleCompleteAuth = useCallback(
    async (profile) => {
      await setUserProfile(profile);
      setUserName(profile?.name ?? "");
      setIsLoggedIn(Boolean(profile?.name));
    },
    [setIsLoggedIn, setUserName, setUserProfile]
  );

  const hasProfile = useMemo(() => Boolean(userProfile?.name), [userProfile?.name]);
  const displayName = useMemo(() => userName || userProfile?.name || "", [userName, userProfile?.name]);

  useEffect(() => {
    if (userProfile?.name) {
      setUserName(userProfile.name);
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn, setUserName, userProfile?.name]);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return showIntro ? (
    <IntroScreen onFinish={handleFinishIntro} />
  ) : hasProfile ? (
    <MainTabs
      userName={displayName}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      setUserName={setUserName}
      LoginCardComponent={LoginCard}
    />
  ) : (
    <AuthScreen onContinue={handleCompleteAuth} />
  );
}

export default function App() {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      <AppStateProvider>
        <RootApp
          userName={userName}
          setUserName={setUserName}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
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
    padding: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  loginTitle: {
    fontSize: 20,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 14,
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
