import React, { createContext, useContext, useMemo } from "react";

const UserContext = createContext(null);

export function UserProvider({ children, user, isPro = false, setUser, setIsPro }) {
  const value = useMemo(
    () => ({
      user: {
        ...(user || {}),
        plan: isPro ? "MoveUp Pro" : user?.plan || "Gratis",
        isPro: !!isPro,
      },
      setUser: setUser || (() => {}),
      setIsPro: setIsPro || (() => {}),
    }),
    [isPro, setIsPro, setUser, user]
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
