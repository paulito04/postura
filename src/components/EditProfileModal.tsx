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

export type EditProfileData = {
  name: string;
  email: string;
  goal: string;
  notificationsEnabled: boolean;
  photoUri?: string | null;
  avatarColor?: string | null;
};

type Props = {
  visible: boolean;
  initialData: EditProfileData;
  onClose: () => void;
  onSave: (data: EditProfileData) => void;
};

const AVATAR_COLORS = ['#FCD3AA', '#DD7631', '#708160', '#D8C593', '#BB3B0E', '#4E6E5D'];

async function pickAndSaveProfilePhoto(
  setProfileImageUri: (uri: string | null) => Promise<void>
): Promise<string | null> {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permiso requerido',
        'Activa el acceso a tus fotos para elegir una imagen.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
      base64: true,
    });

    if (result.canceled) return null;

    const uri = result.assets?.[0]?.uri;
    if (!uri) throw new Error('No se recibió URI de la imagen');

    const profileDir = `${FileSystem.documentDirectory}profile/`;
    await FileSystem.makeDirectoryAsync(profileDir, { intermediates: true }).catch(() => {});

    const extGuess = uri.split('.').pop()?.split('?')[0];
    const ext = extGuess && extGuess.length <= 5 ? extGuess : 'jpg';
    const dest = `${profileDir}avatar.${ext}`;

    await FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});

    let base64 = result.assets?.[0]?.base64 || null;

    if (!base64) {
      try {
        const cleanUri = uri.split('?')[0];
        base64 = await FileSystem.readAsStringAsync(cleanUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (readErr) {
        console.warn('No se pudo leer la imagen seleccionada', readErr);
      }
    }

    if (!base64) {
      throw new Error('No se pudo obtener la imagen en base64');
    }

    await FileSystem.writeAsStringAsync(dest, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await AsyncStorage.setItem(PROFILE_IMAGE_URI_KEY, dest);
    await setProfileImageUri(dest);
    return dest;
  } catch (e: any) {
    console.error('Error guardando foto:', e);
    Alert.alert('Alert', 'No se pudo guardar la foto. Intenta nuevamente.');
    return null;
  }
}

export const EditProfileModal: React.FC<Props> = ({
  visible,
  initialData,
  onClose,
  onSave,
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
  const [selectedAvatarColor, setSelectedAvatarColor] = useState<string | null>(
    initialData.avatarColor ?? null
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialData.name);
      setGoal(initialData.goal);
      setNotificationsEnabled(initialData.notificationsEnabled);
      setPhotoUri(initialData.photoUri);
      setSelectedAvatarColor(initialData.avatarColor ?? null);
      setShowAvatarPicker(false);
    }
  }, [visible, initialData]);

  const handlePickImage = async () => {
    const savedUri = await pickAndSaveProfilePhoto(setProfileImageUri);

    if (savedUri) {
      setPhotoUri(savedUri);
      setSelectedAvatarColor(null);
    }
  };

  const handleSelectAvatar = async (color: string) => {
    setSelectedAvatarColor(color);
    setPhotoUri(null);
    await AsyncStorage.removeItem(PROFILE_IMAGE_URI_KEY);
    await setProfileImageUri(null);
  };

  const handleSave = () => {
    const trimmedName = name?.trim() || "";
    onSave({
      name: trimmedName,
      email: initialData.email,
      goal,
      notificationsEnabled,
      photoUri: photoUri ?? null,
      avatarColor: selectedAvatarColor ?? null,
    });
    onClose();
  };

  const initialLetter =
    name && name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : 'U';

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
              ) : (
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor: selectedAvatarColor ?? AVATAR_COLORS[0],
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
              style={[styles.secondaryButtonInline, showAvatarPicker && styles.secondaryButtonInlineActive]}
              onPress={() => setShowAvatarPicker((prev) => !prev)}
            >
              <Text style={styles.secondaryButtonInlineText}>Elegir avatar predeterminado</Text>
            </TouchableOpacity>

            {showAvatarPicker && (
              <View style={styles.avatarPickerBox}>
                <Text style={styles.helperText}>Elige un color:</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.smallAvatar,
                        {
                          backgroundColor: color,
                          borderWidth: selectedAvatarColor === color ? 3 : 0,
                        },
                      ]}
                      onPress={() => handleSelectAvatar(color)}
                    >
                      <Text style={styles.avatarInitialSmall}>{initialLetter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
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
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#055F67',
  },
  avatarInitialSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
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
  secondaryButtonInlineActive: {
    borderColor: '#055F67',
    backgroundColor: '#EAF4F4',
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
  avatarPickerBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 4,
  },
});

export default EditProfileModal;
