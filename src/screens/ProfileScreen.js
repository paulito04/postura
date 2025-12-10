import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Easing,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { computeStatsFromHistory, getActivityHistory } from "../activityTracker";
import { useAppState } from "../context/AppStateContext";
import { useAppTheme } from "../themeContext";

const GOALS_KEY = "@posturaU_goals";
const NOTIFICATIONS_KEY = "@posturaU_notifications";
const PRIVACY_KEY = "@posturaU_privacy";

const defaultGoals = {
  sessionsPerWeek: "3",
  minutesPerSession: "10",
  reminderTime: "18:00",
};

const defaultNotifications = {
  postureReminders: false,
  weeklySummary: false,
};

const defaultPrivacy = {
  storeHistory: true,
  sendAnonymousData: false,
};

function TermsModal({ visible, onClose, colors }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Términos y condiciones</Text>
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalParagraph, { color: colors.textPrimary }]}>Términos y condiciones de uso</Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              1. Naturaleza del proyecto
              {"\n"}Esta aplicación fue desarrollada por estudiantes universitarios como parte de un proyecto académico. No somos profesionales de la salud, médicos, fisioterapeutas ni especialistas certificados en ergonomía.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              2. Propósito de la aplicación
              {"\n"}El contenido de la app tiene fines educativos e informativos generales sobre hábitos posturales y ergonomía básica. No constituye, en ningún caso, asesoramiento médico, diagnóstico, tratamiento ni sustituto de una consulta con un profesional de la salud.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              3. Limitaciones de responsabilidad
              {"\n"}Aunque se ha puesto cuidado en la elaboración del contenido, pueden existir errores, imprecisiones u omisiones. El uso de la aplicación es responsabilidad exclusiva del usuario. Los desarrolladores y la institución educativa no asumen responsabilidad por lesiones, molestias, daños directos o indirectos que pudieran derivarse del uso de la app o de la realización de los ejercicios sugeridos.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              4. Recomendación profesional
              {"\n"}Antes de iniciar cualquier rutina de ejercicios o cambios importantes en tu postura de trabajo, se recomienda consultar con un médico, fisioterapeuta u otro profesional de la salud calificado, especialmente si tienes antecedentes de dolor, lesiones o condiciones médicas previas.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              5. Datos y privacidad
              {"\n"}La aplicación almacena únicamente la información necesaria para su funcionamiento (por ejemplo, nombre de usuario, historial de actividad y objetivos), principalmente en el propio dispositivo. No se recopilan datos sensibles de salud ni se comparten datos personales con terceros sin tu consentimiento.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              6. Cambios en la aplicación
              {"\n"}Al tratarse de un proyecto universitario en evolución, las funciones, contenidos y diseño de la app pueden cambiar, actualizarse o dejar de estar disponibles sin previo aviso.
            </Text>
            <Text style={[styles.modalParagraph, { color: colors.textSecondary }]}>
              7. Aceptación de términos
              {"\n"}Al utilizar esta aplicación, aceptas estos términos y condiciones y reconoces que se trata de una herramienta educativa creada por estudiantes y no por expertos certificados en ergonomía o salud.
            </Text>
            <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Avatar({ name, colors }) {
  const initials = useMemo(() => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase();
  }, [name]);

  return (
    <View style={[styles.avatar, { backgroundColor: `${colors.primary}22`, borderColor: colors.primary }]}>
      <Text style={[styles.avatarText, { color: colors.primary }]}>{initials || "👤"}</Text>
    </View>
  );
}

function InfoRow({ label, value, colors }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function PremiumBadge({ isPremium }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const colors = ["#BB3B0E", "#DD7631", "#D8C593"];

  useEffect(() => {
    if (!isPremium) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.02,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.98,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [isPremium, pulse]);

  if (!isPremium) return null;

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <LinearGradient
        colors={colors}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.premiumBadge}
      >
        <Text style={styles.premiumBadgeText}>Plan: MoveUp Pro</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export default function ProfileScreen({ user, isLoggedIn, setIsLoggedIn, activeTabKey, isPremium }) {
  const { colors } = useAppTheme();
  const { userProfile, setUserProfile } = useAppState();

  const [goals, setGoals] = useState(defaultGoals);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editableName, setEditableName] = useState(
    user?.username || user?.name || userProfile.name || "Jean Postura"
  );
  const [editableEmail, setEditableEmail] = useState(user?.email || userProfile.email || "usuario@posturau.app");

  const isProfileTab = activeTabKey === "perfil" || activeTabKey === "profile";

  const currentName = isLoggedIn && (user?.username || user?.name || userProfile.name)
    ? user?.username || user?.name || userProfile.name
    : "Sin iniciar sesión";
  const currentEmail = isLoggedIn && (user?.email || userProfile.email)
    ? user?.email || userProfile.email
    : editableEmail;

  useEffect(() => {
    AsyncStorage.getItem(GOALS_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          setGoals({ ...defaultGoals, ...parsed });
        }
      })
      .catch(() => {});

    AsyncStorage.getItem(NOTIFICATIONS_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          setNotifications({ ...defaultNotifications, ...parsed });
        }
      })
      .catch(() => {});

    AsyncStorage.getItem(PRIVACY_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          setPrivacy({ ...defaultPrivacy, ...parsed });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isProfileTab) return;

    const loadHistory = async () => {
      const savedHistory = await getActivityHistory();
      setHistory(savedHistory);
      setStats(computeStatsFromHistory(savedHistory));
    };

    loadHistory();
  }, [isProfileTab]);

  const handleSaveGoals = async () => {
    try {
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      Alert.alert("Objetivos actualizados", "Tus objetivos se han guardado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar tus objetivos. Inténtalo de nuevo.");
    }
  };

  const handleNotificationsChange = async (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));

    if (key === "postureReminders" && value) {
      Alert.alert("Recordatorios", "Configuraremos tus recordatorios de postura pronto.");
    }
  };

  const handlePrivacyChange = async (key, value) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(updated));

    if (key === "storeHistory" && !value) {
      Alert.alert("Historial", "Se podría borrar el historial local en una versión futura.");
    }
  };

  const lastSessions = useMemo(() => {
    const sorted = [...history].sort((a, b) => (a.date < b.date ? 1 : -1));
    return sorted.slice(0, 5);
  }, [history]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleEditProfile = () => {
    if (!editingProfile) {
      setEditingProfile(true);
      return;
    }

    setUserProfile({ name: editableName.trim() || "Jean Postura", email: editableEmail.trim() });
    Alert.alert("Perfil actualizado", "Tus datos se han guardado.");
    setEditingProfile(false);
  };

  const planLabel = isPremium ? "Plan: MoveUp Pro" : "Plan: Gratis";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Avatar name={currentName} colors={colors} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{currentName || "Jean Postura"}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{currentEmail}</Text>
              <View style={styles.planRow}>
                {isPremium ? (
                  <PremiumBadge isPremium={isPremium} />
                ) : (
                  <Text style={[styles.planLabel, { color: colors.primary }]}>{planLabel}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={[styles.editButton, { borderColor: colors.primary, backgroundColor: `${colors.primary}10` }]}
            >
              <Text style={[styles.editText, { color: colors.primary }]}>{editingProfile ? "Guardar" : "Editar datos"}</Text>
            </TouchableOpacity>
          </View>

          {editingProfile && (
            <View style={styles.editForm}>
              <TextInput
                value={editableName}
                onChangeText={setEditableName}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
              />
              <TextInput
                value={editableEmail}
                onChangeText={setEditableEmail}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
              />
            </View>
          )}

          <InfoRow label="Nombre" value={currentName} colors={colors} />
          <InfoRow label="Correo" value={currentEmail} colors={colors} />
          <InfoRow label="Plan" value={planLabel.replace("Plan: ", "") } colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Tus objetivos</Text>
          <View style={styles.formRow}>
            <View style={[styles.formField, { borderColor: colors.border }]}> 
              <Text style={[styles.label, { color: colors.textSecondary }]}>Sesiones por semana</Text>
              <TextInput
                value={goals.sessionsPerWeek}
                keyboardType="numeric"
                onChangeText={(text) => setGoals((prev) => ({ ...prev, sessionsPerWeek: text }))}
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
              />
            </View>
            <View style={[styles.formField, { borderColor: colors.border }]}> 
              <Text style={[styles.label, { color: colors.textSecondary }]}>Minutos por sesión</Text>
              <TextInput
                value={goals.minutesPerSession}
                keyboardType="numeric"
                onChangeText={(text) => setGoals((prev) => ({ ...prev, minutesPerSession: text }))}
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
              />
            </View>
          </View>
          <View style={[styles.formField, { borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Hora recomendada de recordatorio</Text>
            <TextInput
              value={goals.reminderTime}
              onChangeText={(text) => setGoals((prev) => ({ ...prev, reminderTime: text }))}
              placeholder="18:00"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
            />
          </View>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleSaveGoals}>
            <Text style={styles.primaryButtonText}>Guardar objetivos</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Historial de actividad</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tiempo total</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats?.totalMinutes || 0} min</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ejercicios</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats?.totalExercises || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Racha actual</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats?.currentStreak || 0} días</Text>
            </View>
          </View>

          {history.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aún no tienes actividad registrada. Empieza desde la pestaña Ejercicios.
            </Text>
          ) : (
            lastSessions.map((session) => (
              <View key={session.date} style={[styles.sessionRow, { borderColor: colors.border }]}> 
                <View>
                  <Text style={[styles.sessionDate, { color: colors.textPrimary }]}>{formatDate(session.date)}</Text>
                  <Text style={[styles.sessionLabel, { color: colors.textSecondary }]}>Ejercicios: {session.exercises}</Text>
                </View>
                <Text style={[styles.sessionMinutes, { color: colors.primary }]}>{session.minutes} min</Text>
              </View>
            ))
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Configuración</Text>

          <View style={[styles.subCard, { borderColor: colors.border }]}> 
            <Text style={[styles.subTitle, { color: colors.textPrimary }]}>Preferencias de notificaciones</Text>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Recordatorios de postura</Text>
              <Switch
                value={notifications.postureReminders}
                onValueChange={(value) => handleNotificationsChange("postureReminders", value)}
                trackColor={{ true: colors.primary }}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Resumen semanal de progreso</Text>
              <Switch
                value={notifications.weeklySummary}
                onValueChange={(value) => handleNotificationsChange("weeklySummary", value)}
                trackColor={{ true: colors.primary }}
              />
            </View>
          </View>

          <View style={[styles.subCard, { borderColor: colors.border }]}> 
            <Text style={[styles.subTitle, { color: colors.textPrimary }]}>Configuración de privacidad</Text>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Guardar historial de actividad en este dispositivo</Text>
              <Switch
                value={privacy.storeHistory}
                onValueChange={(value) => handlePrivacyChange("storeHistory", value)}
                trackColor={{ true: colors.primary }}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Enviar datos anónimos para mejorar la app</Text>
              <Switch
                value={privacy.sendAnonymousData}
                onValueChange={(value) => handlePrivacyChange("sendAnonymousData", value)}
                trackColor={{ true: colors.primary }}
              />
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Esta app fue desarrollada como proyecto universitario. No envía datos personales sensibles ni comparte información con terceros.
            </Text>
          </View>

          <View style={[styles.subCard, { borderColor: colors.border }]}> 
            <Text style={[styles.subTitle, { color: colors.textPrimary }]}>Suscripción</Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>Plan actual: {isPremium ? "MoveUp Pro" : "Gratis"}</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                if (isPremium) {
                  Alert.alert("Suscripción activa", "Tu suscripción MoveUp Pro está activa. (Simulación)");
                } else {
                  Alert.alert("MoveUp Pro", "Gestiona tu suscripción desde la sección Progreso.");
                }
              }}
            >
              <Text style={styles.primaryButtonText}>{isPremium ? "Gestionar suscripción" : "Actualizar a MoveUp Pro"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowTerms(true)} style={styles.termsButton}>
          <Text style={[styles.termsText, { color: colors.primary }]}>Términos y condiciones</Text>
        </TouchableOpacity>
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} colors={colors} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  planRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  planLabel: {
    fontWeight: "700",
  },
  premiumBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D8C593",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  premiumBadgeText: {
    color: "#FDF3E7",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  editText: {
    fontSize: 12,
    fontWeight: "800",
  },
  editForm: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formField: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F6F7FB",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
  sessionRow: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: "700",
  },
  sessionLabel: {
    fontSize: 12,
  },
  sessionMinutes: {
    fontWeight: "800",
  },
  subCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginTop: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
  },
  termsButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  termsText: {
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    borderRadius: 18,
    padding: 18,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalParagraph: {
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  modalCloseButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "800",
  },
});
