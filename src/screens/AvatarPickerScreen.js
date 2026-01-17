import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { useProfile } from "../context/ProfileContext";
import { defaultAvatars, getAvatarSource, isValidAvatarId, DEFAULT_AVATAR_ID } from "../data/avatars";

export default function AvatarPickerScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { avatarId, setAvatarId, setProfileImageUri } = useProfile();
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarId ?? DEFAULT_AVATAR_ID);
  const avatars = defaultAvatars;

  const previewSource = useMemo(() => getAvatarSource(selectedAvatarId), [selectedAvatarId]);
  const hasAvatars = avatars.length > 0;
  const previewLabel = selectedAvatarId?.replace("avatar_", "Avatar ") || "Avatar";

  const handleSave = async () => {
    if (!isValidAvatarId(selectedAvatarId)) {
      Alert.alert("Avatar inválido", "Selecciona un avatar válido de la lista.");
      return;
    }

    try {
      await setProfileImageUri(null);
      await setAvatarId(selectedAvatarId);
      navigation?.goBack?.();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar tu avatar. Intenta nuevamente.");
    }
  };

  const handleCancel = () => {
    navigation?.goBack?.();
  };

  const renderAvatar = ({ item }) => {
    const isSelected = item.id === selectedAvatarId;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${item.label}`}
        accessibilityState={isSelected ? { selected: true } : undefined}
        onPress={() => setSelectedAvatarId(item.id)}
        style={[styles.avatarItem, isSelected && styles.avatarItemSelected]}
      >
        {item.source ? (
          <Image source={item.source} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarPlaceholderText}>{item.label}</Text>
          </View>
        )}
        {isSelected ? <Text style={styles.selectedBadge}>✓</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Seleccionar foto de perfil</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Elige un avatar predeterminado</Text>
      </View>

      <View style={styles.previewCard}>
        <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Previsualización</Text>
        {previewSource ? (
          <Image source={previewSource} style={styles.previewImage} />
        ) : (
          <View style={[styles.previewFallback, { backgroundColor: colors.primary }]}>
            <Text style={styles.previewFallbackText}>{previewLabel}</Text>
          </View>
        )}
      </View>

      {!hasAvatars ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No hay avatares disponibles.</Text>
        </View>
      ) : (
        <FlatList
          data={avatars}
          keyExtractor={(item) => item.id}
          renderItem={renderAvatar}
          numColumns={4}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Galería de avatares"
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar selección"
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={!hasAvatars}
          accessibilityRole="button"
          accessibilityLabel="Guardar avatar seleccionado"
        >
          <Text style={styles.primaryButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  header: {
    gap: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
  },
  previewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  previewFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  previewFallbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  gridContent: {
    paddingBottom: 16,
    gap: 12,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  avatarItem: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarItemSelected: {
    borderColor: "#055F67",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  avatarPlaceholderText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "#055F67",
    color: "#fff",
    width: 18,
    height: 18,
    textAlign: "center",
    borderRadius: 9,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
