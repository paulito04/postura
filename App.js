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

function RootApp({
  user,
  setUser,
  isLoggedIn,
  setIsLoggedIn,
  handleLogin,
  userHydrated,
}) {
  const { hydrated: appHydrated } = useAppState();
  const [showIntro, setShowIntro] = useState(true);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);

  const handleFinishIntro = useCallback(() => {
    setShowIntro(false);
    setShouldShowLogin(!isLoggedIn);
  }, [isLoggedIn]);

  const displayName = useMemo(
    () => user?.username || user?.name || "Usuario",
    [user?.name, user?.username]
  );

  if (!appHydrated || !userHydrated) {
    return <LoadingScreen />;
  }

  if (showIntro) {
    return <IntroScreen onFinish={handleFinishIntro} />;
  }

  return (
    <MainTabs
      user={user}
      userName={displayName}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      setUser={setUser}
      onLogin={(payload) => {
        handleLogin(payload);
        setShouldShowLogin(false);
      }}
      LoginCardComponent={LoginModal}
      lockNavigation={!isLoggedIn || shouldShowLogin}
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
