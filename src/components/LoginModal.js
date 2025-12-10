import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PRIMARY_COLOR = "#055F67";

export default function LoginModal({ visible, onLogin, user }) {
  const [identifier, setIdentifier] = useState(user?.email || user?.name || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setIdentifier(user?.email || user?.name || "");
    setPassword("");
  }, [user?.email, user?.name]);

  const derivedEmail = useMemo(() => {
    if (user?.email) return user.email;
    if (identifier.includes("@")) return identifier.trim();
    if (!identifier.trim()) return "";
    return `${identifier.trim()}@posturau.app`;
  }, [identifier, user?.email]);

  const derivedName = useMemo(() => {
    if (user?.name) return user.name;
    if (identifier.trim()) return identifier.trim();
    return "";
  }, [identifier, user?.name]);

  if (!visible) return null;

  const handleLogin = () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      Alert.alert("Campos requeridos", "Ingresa tus datos para continuar");
      return;
    }

    onLogin({
      name: derivedName || trimmedIdentifier,
      email: derivedEmail || `${trimmedIdentifier}@posturau.app`,
      rememberMe,
    });
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Funcionalidad próximamente disponible");
  };

  const handleRegister = () => {
    Alert.alert("Registro", "Funcionalidad próximamente disponible");
  };

  return (
    <LinearGradient
      colors={["#E3F2FD", "#E0F7FA", "#F3E5F5"]}
      style={styles.loginOverlay}
      pointerEvents="auto"
    >
      <View style={styles.loginCardWrapper}>
        <View style={styles.loginAvatar}>
          <Text style={styles.loginAvatarIcon}>👤</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Inicia sesión</Text>

          <View style={styles.loginInputWrapper}>
            <View style={styles.loginInputIconCircle}>
              <Text style={styles.loginInputIcon}>@</Text>
            </View>
            <TextInput
              style={styles.loginInput}
              placeholder="Correo o usuario"
              placeholderTextColor="#7a7a7a"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.loginInputWrapper}>
            <View style={styles.loginInputIconCircle}>
              <Text style={styles.loginInputIcon}>🔒</Text>
            </View>
            <TextInput
              style={styles.loginInput}
              placeholder="Contraseña"
              placeholderTextColor="#7a7a7a"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.loginFooterRow}>
            <View style={styles.rememberRow}>
              <Switch value={rememberMe} onValueChange={setRememberMe} trackColor={{ true: `${PRIMARY_COLOR}66` }} thumbColor={rememberMe ? PRIMARY_COLOR : "#f4f3f4"} />
              <Text style={styles.rememberLabel}>Recordarme</Text>
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.loginBottomText}>
        ¿No tienes cuenta?{" "}
        <Text style={styles.loginBottomLink} onPress={handleRegister}>
          REGÍSTRATE AQUÍ
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loginOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginCardWrapper: {
    width: "85%",
    alignItems: "center",
  },
  loginAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -40,
    zIndex: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginAvatarIcon: {
    fontSize: 32,
    color: "#fff",
  },
  loginCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    paddingTop: 48,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    color: "#0A393C",
  },
  loginInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loginInputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E9F5F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  loginInputIcon: {
    fontSize: 16,
    color: PRIMARY_COLOR,
  },
  loginInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberLabel: {
    fontSize: 13,
    color: "#2b2b2b",
    fontWeight: "600",
  },
  forgotText: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
  loginBottomText: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    fontSize: 12,
    color: "#333",
  },
  loginBottomLink: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
});
