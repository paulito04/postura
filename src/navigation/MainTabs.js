import React, { useCallback, useMemo, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ExercisesScreen from "../screens/ExercisesScreen";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProgressScreen from "../screens/ProgressScreen";
import StreakDetailScreen from "../screens/StreakDetailScreen";
import { UserProvider } from "../UserContext";
import { useAppTheme } from "../themeContext";

const tabs = [
  { key: "Inicio", icon: "🏠", component: HomeScreen },
  { key: "Ejercicios", icon: "🏋️", component: ExercisesScreen },
  { key: "Progreso", icon: "📈", component: ProgressScreen },
  { key: "Aprender", icon: "📚", component: LearnScreen },
  { key: "Perfil", icon: "👤", component: ProfileScreen },
];

const proPalette = {
  light: "#FCD3AA",
  warm: "#D8C593",
  deep: "#BB3B0E",
  accent: "#DD7631",
  sage: "#708160",
};

export default function MainTabs({ user, userName, isLoggedIn, setIsLoggedIn, setUser, onLogin, LoginCardComponent }) {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tabParams, setTabParams] = useState({});
  const [stackScreen, setStackScreen] = useState(null);

  const stackRegistry = useMemo(
    () => ({
      StreakDetail: StreakDetailScreen,
    }),
    []
  );

  const navigate = useCallback(
    (screenName, params = {}) => {
      const exists = tabs.some((tab) => tab.key === screenName);
      if (exists) {
        setStackScreen(null);
        setActiveTab(screenName);
        setTabParams((prev) => ({ ...prev, [screenName]: params }));
        return;
      }

      if (stackRegistry[screenName]) {
        setStackScreen({ name: screenName, params });
      }
    },
    [stackRegistry]
  );

  const goBack = useCallback(() => {
    setStackScreen(null);
  }, []);

  const navigation = useMemo(() => ({ navigate, goBack }), [goBack, navigate]);

  const ActiveComponent = useMemo(() => {
    if (stackScreen) {
      return stackRegistry[stackScreen.name];
    }
    return tabs.find((tab) => tab.key === activeTab)?.component ?? HomeScreen;
  }, [activeTab, stackRegistry, stackScreen]);
  const activeProps = stackScreen ? stackScreen.params : tabParams[activeTab];

  const handleTabPress = (tabName) => {
    if (!isLoggedIn) return;
    setActiveTab(tabName);
    if ((tabName === "Progreso" || tabName === "Aprender") && !isPremium) {
      setShowPaywall(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        <UserProvider user={user} isPro={isPremium} setUser={setUser} setIsPro={setIsPremium}>
          <ActiveComponent
            navigation={navigation}
            user={user}
            userName={userName}
            tabParams={activeProps}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            activeTabKey={activeTab.toLowerCase() === "progreso" ? "progress" : activeTab.toLowerCase()}
            isPremium={isPremium}
          />
        </UserProvider>
      </View>

      <View style={[styles.tabBar, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const color = isActive ? colors.primary : colors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : undefined}
              onPress={() => handleTabPress(tab.key)}
              style={[
                styles.tabButton,
                isActive && { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color, fontWeight: isActive ? "800" : "600" }]}>{tab.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {LoginCardComponent ? (
        <LoginCardComponent visible={!isLoggedIn} user={user} onLogin={onLogin} />
      ) : null}

      {showPaywall && (
        <View style={styles.paywallOverlay} pointerEvents="auto">
          <View style={styles.paywallCard}>
            <View style={styles.paywallGlow} />
            <View style={styles.paywallTopRow}>
              <View style={styles.paywallIconBadge}>
                <Image source={require("../../assets/logo.jpg")} style={styles.paywallLogo} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paywallTitle}>Desbloquea</Text>
                <Text style={styles.paywallTitle}>MOVEUP Pro</Text>
                <Text style={styles.paywallPrice}>$9,99/mes</Text>
              </View>
            </View>

            <Text style={styles.paywallSubtitle}>obtén acceso completo a</Text>

            <View style={styles.paywallFeatureList}>
              <View style={styles.paywallFeatureRow}>
                <View style={[styles.paywallBulletIcon, { backgroundColor: "#FDF0C9" }]}>
                  <Text style={styles.paywallBulletEmoji}>📊</Text>
                </View>
                <Text style={styles.paywallBulletText}>panel de progreso con estadísticas</Text>
              </View>
              <View style={styles.paywallFeatureRow}>
                <View style={[styles.paywallBulletIcon, { backgroundColor: "#F8E0CD" }]}>
                  <Text style={styles.paywallBulletEmoji}>🏆</Text>
                </View>
                <Text style={styles.paywallBulletText}>logros, insignias y recompensas</Text>
              </View>
              <View style={styles.paywallFeatureRow}>
                <View style={[styles.paywallBulletIcon, { backgroundColor: "#F6D8FF" }]}>
                  <Text style={styles.paywallBulletEmoji}>📚</Text>
                </View>
                <Text style={styles.paywallBulletText}>módulo educativo “Aprender” con contenido ergonómico</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.paywallPrimaryButton}
              onPress={() => {
                setIsPremium(true);
                setShowPaywall(false);
              }}
              activeOpacity={0.9}
            >
              <View style={styles.paywallPrimaryGradient}>
                <Text style={styles.paywallPrimaryText}>Activar Membresía</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paywallSecondaryButton}
              onPress={() => {
                setShowPaywall(false);
                setActiveTab("Inicio");
              }}
            >
              <Text style={styles.paywallSecondaryText}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  paywallOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8, 10, 22, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 999,
  },
  paywallCard: {
    width: "100%",
    backgroundColor: "#141826",
    borderRadius: 22,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    borderWidth: 1,
    borderColor: "#272C3F",
  },
  paywallGlow: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 200,
    height: 200,
    backgroundColor: "rgba(255, 153, 102, 0.25)",
    borderRadius: 120,
    opacity: 0.9,
  },
  paywallTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  paywallIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFB573",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF8A00",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  paywallLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    resizeMode: "cover",
  },
  paywallTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FDF8ED",
    letterSpacing: 0.2,
  },
  paywallPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFC58A",
    marginTop: 2,
  },
  paywallSubtitle: {
    fontSize: 14,
    color: "#D7DAE3",
    marginTop: 16,
    marginBottom: 12,
  },
  paywallFeatureList: {
    gap: 10,
  },
  paywallFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paywallBulletIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  paywallBulletEmoji: {
    fontSize: 18,
  },
  paywallBulletText: {
    flex: 1,
    color: "#F5F7FB",
    fontSize: 14,
    fontWeight: "600",
  },
  paywallPrimaryButton: {
    width: "100%",
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FF8A3D",
    shadowColor: "#FF8A00",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  paywallPrimaryGradient: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  paywallPrimaryText: {
    color: "#0E1020",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  paywallSecondaryButton: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  paywallSecondaryText: {
    color: "#C5CAD9",
    fontSize: 14,
    fontWeight: "700",
  },
});
