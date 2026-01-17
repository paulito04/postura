import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../AuthContext";
import { DEFAULT_AVATAR_ID, isValidAvatarId } from "../data/avatarCatalog";

export const PROFILE_IMAGE_URI_KEY = "profileImageUri";
export const PROFILE_DISPLAY_NAME_KEY = "profileDisplayName";
export const PROFILE_AVATAR_ID_KEY = "profileAvatarId";

type ProfileContextValue = {
  profileImageUri: string | null;
  setProfileImageUri: (uri: string | null) => Promise<void>;
  avatarId: string | null;
  setAvatarId: (avatarId: string | null) => Promise<void>;
  displayName: string;
  setDisplayName: (name: string) => Promise<void>;
  loadProfileFromStorage: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(null);
  const [displayName, setDisplayNameState] = useState<string>("Usuario");
  const [avatarId, setAvatarIdState] = useState<string | null>(DEFAULT_AVATAR_ID);
  const { user } = useAuth();

  const loadProfileFromStorage = useCallback(async () => {
    try {
      const [storedImage, storedDisplayName, storedAvatarId] = await Promise.all([
        AsyncStorage.getItem(PROFILE_IMAGE_URI_KEY),
        AsyncStorage.getItem(PROFILE_DISPLAY_NAME_KEY),
        AsyncStorage.getItem(PROFILE_AVATAR_ID_KEY),
      ]);

      const fallbackName = user?.name?.trim() || user?.username?.trim() || "Usuario";
      const resolvedName = storedDisplayName?.trim() || fallbackName;
      const nextAvatarId = isValidAvatarId(storedAvatarId) ? storedAvatarId : DEFAULT_AVATAR_ID;

      setDisplayNameState(resolvedName);
      setProfileImageUriState(storedImage ?? null);
      setAvatarIdState(nextAvatarId);
    } catch (error) {
      console.warn("No se pudo cargar el perfil", error);
      setProfileImageUriState(null);
      setDisplayNameState(user?.name?.trim() || user?.username?.trim() || "Usuario");
      setAvatarIdState(DEFAULT_AVATAR_ID);
    }
  }, [user?.name, user?.username]);

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

  const setAvatarId = useCallback(async (nextAvatarId: string | null) => {
    const resolved = isValidAvatarId(nextAvatarId) ? nextAvatarId : DEFAULT_AVATAR_ID;

    try {
      if (resolved) {
        await AsyncStorage.setItem(PROFILE_AVATAR_ID_KEY, resolved);
      } else {
        await AsyncStorage.removeItem(PROFILE_AVATAR_ID_KEY);
      }
    } catch (error) {
      console.warn("No se pudo guardar el avatar", error);
    }

    setAvatarIdState(resolved);
  }, []);

  const setDisplayName = useCallback(async (name: string) => {
    const trimmed = name?.trim() || "";
    const nextName = trimmed || "Usuario";

    try {
      await AsyncStorage.setItem(PROFILE_DISPLAY_NAME_KEY, nextName);
    } catch (error) {
      console.warn("No se pudo guardar el nombre de perfil", error);
    }

    setDisplayNameState(nextName);
  }, []);

  useEffect(() => {
    loadProfileFromStorage();
  }, [loadProfileFromStorage]);

  return (
    <ProfileContext.Provider
      value={{
        profileImageUri,
        setProfileImageUri,
        avatarId,
        setAvatarId,
        displayName,
        setDisplayName,
        loadProfileFromStorage,
      }}
    >
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
