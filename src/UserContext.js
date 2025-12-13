import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const STORAGE_KEY = "moveup_user";
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserState(parsed);
        }
      } catch (error) {
        console.error("Error al cargar el usuario", error);
      } finally {
        setHydrated(true);
      }
    };

    loadUser();
  }, []);

  const setUser = useCallback(async (nextUser) => {
    setUserState(nextUser);
    try {
      if (nextUser) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error al guardar el usuario", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      user: user
        ? {
            ...user,
            plan: user.plan || (user.isPro ? "MoveUp Pro" : "Gratis"),
            isPro: !!user.isPro,
          }
        : null,
      setUser,
      hydrated,
    }),
    [hydrated, setUser, user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}
