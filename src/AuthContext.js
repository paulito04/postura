import React, { createContext, useCallback, useContext, useMemo } from "react";

import { useUser } from "./UserContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, setUser, hydrated } = useUser();

  const login = useCallback(
    ({ username, name, email }) => {
      const trimmedUsername = username?.trim();
      if (!trimmedUsername) return;

      const displayName = name?.trim() || trimmedUsername;
      const normalizedEmail =
        email?.trim() || `${trimmedUsername.toLowerCase()}@posturau.app`;

      setUser({
        ...(user || {}),
        username: trimmedUsername,
        name: displayName,
        email: normalizedEmail,
      });
    },
    [setUser, user]
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      hydrated,
    }),
    [hydrated, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}

