import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { PROFILE_IMAGE_URI_KEY, useProfile } from '../context/ProfileContext';
import { getAvatarSource } from "../data/avatars";

export type EditProfileData = {
  name: string;
  email: string;
  goal: string;
  notificationsEnabled: boolean;
  photoUri?: string | null;
  avatarColor?: string | null;
  avatarId?: string | null;
};

type Props = {
  visible: boolean;
  initialData: EditProfileData;
  onClose: () => void;
  onSave: (data: EditProfileData) => void;
  onOpenAvatarPicker: () => void;
};

const DEFAULT_AVATAR_COLOR = "#055F67";

async function pickAndSaveProfilePhoto(
  setProfileImageUri: (uri: string | null) => Promise<void>
): Promise<string | null> {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permiso requerido", "Activa el acceso a tus fotos para elegir una imagen.");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
      base64: true, // importante
    });

    if (result.canceled) return null;

    const asset = result.assets?.[0];
    const uri = asset?.uri;
    if (!uri) throw new Error("No se recibió URI de la imagen");

    const fsAny = FileSystem as any;
    console.log("FS dirs:", fsAny.documentDirectory, fsAny.cacheDirectory);

    const baseDir: string | undefined = fsAny.documentDirectory || fsAny.cacheDirectory;

    if (!baseDir) {
      console.log("FS is not available. Fallback to saving original uri:", uri);

      // Fallback: guarda el uri directo (temporal, pero te deja usar foto)
      await AsyncStorage.setItem(PROFILE_IMAGE_URI_KEY, uri);
      await setProfileImageUri(uri);
      return uri;
    }

    const profileDir = `${baseDir}profile/`;
    await FileSystem.makeDirectoryAsync(profileDir, { intermediates: true }).catch(() => {});

    // Usa jpg fijo para evitar problemas de extensión
    const dest = `${profileDir}avatar.jpg`;

    await FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});

    // Intento 1: copiar archivo (si el uri es file:// funciona perfecto)
    try {
      await FileSystem.copyAsync({ from: uri, to: dest });
    } catch (copyErr) {
      // Intento 2 (Android content://): escribir base64 directo desde el picker
      const base64 = asset?.base64;
      if (!base64) {
        console.warn("copyAsync falló y no vino base64. uri:", uri, "err:", copyErr);
        throw new Error("No vino base64 del picker para fallback");
      }

      await FileSystem.writeAsStringAsync(dest, base64, { encoding: "base64" });
    }

    await AsyncStorage.setItem(PROFILE_IMAGE_URI_KEY, dest);
    await setProfileImageUri(dest);
    return dest;
  } catch (e) {
    console.error("Error guardando foto:", e);
    Alert.alert("Alert", "No se pudo guardar la foto. Intenta nuevamente.");
    return null;
  }
}


export const EditProfileModal: React.FC<Props> = ({
  visible,
  initialData,
  onClose,
  onSave,
  onOpenAvatarPicker,
}) => {
  const { setProfileImageUri } = useProfile();
  const [name, setName] = useState(initialData.name);
  const [goal, setGoal] = useState(initialData.goal);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialData.notificationsEnabled
  );
  const [photoUri, setPhotoUri] = useState<string | null | undefined>(
    initialData.photoUri
  );
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
    initialData.avatarId ?? null
  );

  useEffect(() => {
    if (visible) {
      setName(initialData.name);
      setGoal(initialData.goal);
      setNotificationsEnabled(initialData.notificationsEnabled);
      setPhotoUri(initialData.photoUri);
      setSelectedAvatarId(initialData.avatarId ?? null);
    }
  }, [visible, initialData]);

  const handlePickImage = async () => {
    const savedUri = await pickAndSaveProfilePhoto(setProfileImageUri);

    if (savedUri) {
      setPhotoUri(savedUri);
    }
  };

  const handleSave = () => {
    const trimmedName = name?.trim() || "";
    onSave({
      name: trimmedName,
      email: initialData.email,
      goal,
      notificationsEnabled,
      photoUri: photoUri ?? null,
      avatarColor: initialData.avatarColor ?? null,
      avatarId: selectedAvatarId ?? null,
    });
    onClose();
  };

  const initialLetter =
    name && name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : 'U';
  const avatarSource = selectedAvatarId ? getAvatarSource(selectedAvatarId) : null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Editar perfil</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.avatarPreviewContainer}>
              {photoUri ? (
                <View
                  style={[
                    styles.avatarCircle,
                    { overflow: 'hidden', backgroundColor: '#fff' },
                  ]}
                >
                  <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                </View>
              ) : avatarSource ? (
                <View
                  style={[
                    styles.avatarCircle,
                    { overflow: 'hidden', backgroundColor: '#fff' },
                  ]}
                >
                  <Image source={avatarSource} style={styles.avatarImage} />
                </View>
              ) : (
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor: DEFAULT_AVATAR_COLOR,
                    },
                  ]}
                >
                  <Text style={styles.avatarInitial}>{initialLetter}</Text>
                </View>
              )}
            </View>

            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu nombre"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={initialData.email}
              editable={false}
            />

            <Text style={styles.label}>Objetivo postural</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Ej. Mejorar mi postura en la jornada de oficina"
              value={goal}
              onChangeText={setGoal}
              multiline
            />

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Notificaciones</Text>
                <Text style={styles.helperText}>
                  Recordatorios de pausas activas y ejercicios.
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <Text style={styles.sectionTitle}>Foto de perfil</Text>

            <TouchableOpacity style={styles.mainButton} onPress={handlePickImage}>
              <Text style={styles.mainButtonText}>
                Cambiar foto desde el dispositivo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButtonInline}
              onPress={onOpenAvatarPicker}
              accessibilityRole="button"
              accessibilityLabel="Elegir avatar predeterminado"
            >
              <Text style={styles.secondaryButtonInlineText}>Elegir avatar predeterminado</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#055F67',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  avatarPhotoText: {
    fontSize: 12,
    color: '#055F67',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  inputDisabled: {
    color: '#999',
  },
  inputMultiline: {
    height: 72,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
    color: '#055F67',
  },
  mainButton: {
    backgroundColor: '#055F67',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  mainButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#E0E0E0',
  },
  secondaryButtonInline: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#055F6760',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginTop: 6,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  secondaryButtonInlineText: {
    color: '#055F67',
    fontWeight: '700',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#055F67',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default EditProfileModal;
