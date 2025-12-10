import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY_COLOR = "#055F67";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal({ visible, onLogin, user }) {
  const initialUsername = user?.username || user?.name || "";
  const initialEmail = user?.email || (initialUsername ? `${initialUsername}@posturau.app` : "");
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [emailEditedManually, setEmailEditedManually] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const nextUsername = user?.username || user?.name || "";
    const nextEmail = user?.email || (nextUsername ? `${nextUsername}@posturau.app` : "");
    setUsername(nextUsername);
    setPassword("");
    setEmail(nextEmail);
    setEmailEditedManually(Boolean(user?.email));
  }, [user?.email, user?.name, user?.username]);

  useEffect(() => {
    if (!emailEditedManually) {
      setEmail(username ? `${username.trim()}@posturau.app` : "");
    }
  }, [emailEditedManually, username]);

  const derivedEmail = useMemo(() => email.trim(), [email]);
  const derivedName = useMemo(() => username.trim(), [username]);

  const validateEmail = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setEmailError("Por favor ingresa tu correo electrónico.");
      return false;
    }

    if (!emailRegex.test(trimmed)) {
      setEmailError("Ingresa un correo válido (por ejemplo: usuario@gmail.com).");
      return false;
    }

    // Si en algún momento quiero limitar a Gmail, descomentar:
    // if (!trimmed.toLowerCase().endsWith("@gmail.com")) {
    //   setEmailError("Por ahora solo aceptamos correos de Gmail (@gmail.com).");
    //   return false;
    // }

    setEmailError("");
    return true;
  };

  if (!visible) return null;

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const trimmedIdentifier = derivedName;
    const trimmedPassword = password.trim();

    if (!isEmailValid) {
      return;
    }

    if (!trimmedIdentifier || !trimmedPassword) {
      Alert.alert("Campos requeridos", "Ingresa tus datos para continuar");
      return;
    }

    onLogin({
      username: trimmedIdentifier,
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
    <View style={styles.loginOverlay} pointerEvents="auto">
      <View style={styles.loginCardWrapper}>
        <View style={styles.loginAvatar}>
          <Text style={styles.loginAvatarIcon}>👤</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Inicia sesión</Text>

          <View style={styles.loginInputWrapper}>
            <View style={styles.loginInputIconCircle}>
              <Text style={styles.loginInputIcon}>👤</Text>
            </View>
            <TextInput
              style={styles.loginInput}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="#7a7a7a"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.loginInputWrapper, emailError ? styles.loginInputWrapperError : null]}>
            <View style={styles.loginInputIconCircle}>
              <Text style={styles.loginInputIcon}>@</Text>
            </View>
            <TextInput
              style={styles.loginInput}
              placeholder="Correo"
              placeholderTextColor="#7a7a7a"
              value={email}
              onChangeText={(value) => {
                setEmailEditedManually(true);
                setEmail(value);
                if (emailError) {
                  validateEmail(value);
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={() => validateEmail(email)}
            />
          </View>

          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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

          <TouchableOpacity
            style={[styles.loginButton, (!derivedEmail || emailError) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!derivedEmail || Boolean(emailError)}
          >
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
    </View>
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
    backgroundColor: "#E5F1F6",
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
  loginInputWrapperError: {
    borderColor: "#E53935",
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
  loginButtonDisabled: {
    opacity: 0.65,
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
  errorText: {
    marginTop: -8,
    marginBottom: 8,
    fontSize: 12,
    color: "#E53935",
  },
});
