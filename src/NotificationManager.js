import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@notification_prefs_v1";

const NotificationContext = createContext(null);

const defaultPrefs = {
  enabled: true,
  // Horario activo (HH:mm en 24h)
  activeFrom: "09:00",
  activeTo: "18:00",
  // Intervalo aleatorio entre recordatorios
  minIntervalMinutes: 45,
  maxIntervalMinutes: 60,
  // Tipo de recordatorios
  reminderType: {
    sound: true,
    vibration: true,
    visual: true,
  },
  // Modo concentración (silencia todo)
  focusMode: false,
};

function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function getRandomDelayMs(minMinutes, maxMinutes) {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  const diff = maxMs - minMs;
  return minMs + Math.floor(Math.random() * diff);
}

function getNextNotificationDate(prefs) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = parseTimeToMinutes(prefs.activeFrom);
  const endMinutes = parseTimeToMinutes(prefs.activeTo);

  let base = new Date(now);

  // Si estamos antes del horario activo → hoy a la hora de inicio
  if (nowMinutes < startMinutes) {
    base.setHours(Math.floor(startMinutes / 60));
    base.setMinutes(startMinutes % 60);
    base.setSeconds(0);
    base.setMilliseconds(0);
  }
  // Si estamos después del horario activo → mañana a la hora de inicio
  else if (nowMinutes > endMinutes) {
    base.setDate(base.getDate() + 1);
    base.setHours(Math.floor(startMinutes / 60));
    base.setMinutes(startMinutes % 60);
    base.setSeconds(0);
    base.setMilliseconds(0);
  }

  // Añadir delay aleatorio
  const delayMs = getRandomDelayMs(
    prefs.minIntervalMinutes,
    prefs.maxIntervalMinutes
  );
  const next = new Date(base.getTime() + delayMs);

  // Si se pasa del horario activo, mover a siguiente día al inicio
  const nextMinutes = next.getHours() * 60 + next.getMinutes();
  if (nextMinutes > endMinutes) {
    next.setDate(next.getDate() + 1);
    next.setHours(Math.floor(startMinutes / 60));
    next.setMinutes(startMinutes % 60);
    next.setSeconds(0);
    next.setMilliseconds(0);
  }

  return next;
}

export function NotificationProvider({ children }) {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [isReady, setIsReady] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  // Cargar preferencias de AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPrefs((prev) => ({ ...prev, ...JSON.parse(stored) }));
        }
      } catch (e) {
        console.warn("Error loading notification prefs", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Guardar preferencias en AsyncStorage
  const savePrefs = useCallback(async (newPrefs) => {
    try {
      setPrefs(newPrefs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (e) {
      console.warn("Error saving notification prefs", e);
    }
  }, []);

  // Solicitar permisos de notificación
  const ensurePermissions = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  }, []);

  // Cancelar todas las notificaciones programadas por la app
  const cancelAllScheduled = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.warn("Error cancelling scheduled notifications", e);
    }
  }, []);

  // Programar la próxima notificación
  const scheduleNextNotification = useCallback(
    async (currentPrefs) => {
      const effectivePrefs = currentPrefs || prefs;

      if (!effectivePrefs.enabled || effectivePrefs.focusMode) {
        await cancelAllScheduled();
        return;
      }

      const hasPerms = await ensurePermissions();
      if (!hasPerms) {
        console.warn("Notifications not permitted");
        return;
      }

      const nextDate = getNextNotificationDate(effectivePrefs);

      const soundEnabled =
        effectivePrefs.reminderType.sound &&
        !effectivePrefs.focusMode &&
        effectivePrefs.enabled;

      // Nota: la vibración en Android depende del canal;
      // aquí asumimos canal por defecto. Para más control,
      // se debería crear un canal específico.

      try {
        await cancelAllScheduled();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Momento de moverte 🧍‍♂️",
            body: "Toma un minuto para corregir tu postura y estirarte.",
            sound: soundEnabled ? "default" : null,
            data: { type: "posture_reminder" },
          },
          trigger: nextDate,
        });
      } catch (e) {
        console.warn("Error scheduling notification", e);
      }
    },
    [prefs, cancelAllScheduled, ensurePermissions]
  );

  // Reprogramar cuando cambian preferencias
  useEffect(() => {
    if (!isReady) return;
    scheduleNextNotification(prefs);
  }, [prefs, isReady, scheduleNextNotification]);

  // Reaccionar a cambios de estado de la app (foreground/background)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
      if (nextState === "active") {
        scheduleNextNotification(prefs);
      }
    });

    return () => sub.remove();
  }, [prefs, scheduleNextNotification]);

  // API para la UI

  const updatePreferences = (updates) => {
    const merged = { ...prefs, ...updates };

    // Si el usuario cambia solo una parte de reminderType
    if (updates.reminderType) {
      merged.reminderType = {
        ...prefs.reminderType,
        ...updates.reminderType,
      };
    }

    savePrefs(merged);
  };

  const toggleFocusMode = () => {
    const updated = { ...prefs, focusMode: !prefs.focusMode };
    savePrefs(updated);
  };

  const value = {
    prefs,
    updatePreferences,
    toggleFocusMode,
    scheduleNextNotification,
    isReady,
    appState,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationManager() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationManager debe usarse dentro de NotificationProvider");
  }
  return ctx;
}
