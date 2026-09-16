import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigation.navigate("Home");
    }
  }, [token, navigation]);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Por favor completa email y contraseña.");
      return;
    }

    setLoading(true);

    try {

      await login(email.trim(), password);
    } catch (error_) {
      let message = "Error al iniciar sesión. Intenta nuevamente.";

      if (
        error_.code === "auth/invalid-credential" ||
        error_.code === "auth/user-not-found" ||
        error_.code === "auth/wrong-password"
      ) {
        message = "Email o contraseña incorrectos.";
      } else if (error_.code === "auth/invalid-email") {
        message = "El formato del correo electrónico no es válido.";
      } else if (error_.code === "auth/too-many-requests") {
        message = "Muchos intentos fallidos. Intenta más tarde.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Inicia sesión</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@dominio.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Recuperar contraseña", "Opción en desarrollo")
          }
        >
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4f46e5",
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;