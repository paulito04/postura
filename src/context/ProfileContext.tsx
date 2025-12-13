import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_IMAGE_URI_KEY = "profileImageUri";

type ProfileContextValue = {
  profileImageUri: string | null;
  setProfileImageUri: (uri: string | null) => Promise<void>;
  loadProfileFromStorage: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(null);

  const loadProfileFromStorage = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_IMAGE_URI_KEY);
      setProfileImageUriState(stored ?? null);
    } catch (error) {
      console.warn("No se pudo cargar la foto de perfil", error);
      setProfileImageUriState(null);
    }
  }, []);

  const setProfileImageUri = useCallback(async (uri: string | null) => {
    try {
      if (uri) {
        await AsyncStorage.setItem(PROFILE_IMAGE_URI_KEY, uri);
      } else {
        await AsyncStorage.removeItem(PROFILE_IMAGE_URI_KEY);
      }
    } catch (error) {
      console.warn("No se pudo guardar la foto de perfil", error);
    }

    setProfileImageUriState(uri);
  }, []);

  useEffect(() => {
    loadProfileFromStorage();
  }, [loadProfileFromStorage]);

  return (
    <ProfileContext.Provider value={{ profileImageUri, setProfileImageUri, loadProfileFromStorage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile debe usarse dentro de un ProfileProvider");
  }

  return context;
}
