import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  userName: "userName",
  userEmail: "userEmail",
  discomfort: "discomfortLevel",
};

const defaultProfile = { name: "", email: "" };

const AppStateContext = createContext({});

export function AppStateProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [discomfortLevel, setDiscomfortLevel] = useState(2);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [storedName, storedEmail, storedDiscomfort] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.userName),
          AsyncStorage.getItem(STORAGE_KEYS.userEmail),
          AsyncStorage.getItem(STORAGE_KEYS.discomfort),
        ]);

        if (storedName) {
          setUserProfile({ name: storedName, email: storedEmail || "" });
        }

        if (storedDiscomfort !== null && !Number.isNaN(Number(storedDiscomfort))) {
          setDiscomfortLevel(Math.min(10, Math.max(0, Number(storedDiscomfort))));
        }
      } catch (error) {
        console.error("Error al cargar el estado de la app", error);
      } finally {
        setHydrated(true);
      }
    };

    loadState();
  }, []);

  const persistProfile = useCallback(async (profile) => {
    try {
      const safeProfile = profile || defaultProfile;
      setUserProfile(safeProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.userName, safeProfile.name || "");
      if (safeProfile.email) {
        await AsyncStorage.setItem(STORAGE_KEYS.userEmail, safeProfile.email);
      }
    } catch (error) {
      console.error("Error al guardar el perfil", error);
    }
  }, []);

  const updateDiscomfort = useCallback(async (value) => {
    const clamped = Math.min(10, Math.max(0, Number.isNaN(Number(value)) ? 0 : Number(value)));
    setDiscomfortLevel(clamped);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.discomfort, String(clamped));
    } catch (error) {
      console.error("Error al guardar el nivel de molestia", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      userProfile,
      setUserProfile: persistProfile,
      discomfortLevel,
      updateDiscomfort,
    }),
    [discomfortLevel, hydrated, persistProfile, userProfile, updateDiscomfort]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  return useContext(AppStateContext);
}
