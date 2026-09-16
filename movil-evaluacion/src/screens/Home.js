import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const navigation = useNavigation();
  const { user, token, logout, updateUserData } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [carnet, setCarnet] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setEmail(user.email || "");
      setCarnet(user.carnet || "");
      setFechaNacimiento(user.fecha_nacimiento || "");
    }
  }, [user]);

  useEffect(() => {
    if (!token) {
      navigation.navigate("Login");
    }
  }, [token, navigation]);

  const handleUpdateProfile = async () => {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert("Error", "El nombre y correo son obligatorios.");
      return;
    }

    try {
      await updateUserData({
        nombre: nombre.trim(),
        email: email.trim(),
        carnet: carnet.trim(),
        fecha_nacimiento: fechaNacimiento.trim(),
      });

      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente en Firestore.");
    } catch (error) {
      Alert.alert("Error", "No se pudieron actualizar los datos.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Carnet</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={carnet}
              onChangeText={setCarnet}
            />
          ) : (
            <Text style={styles.valueText}>{user?.carnet || "N/A"}</Text>
          )}
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
          ) : (
            <Text style={styles.valueText}>{user?.nombre || "N/A"}</Text>
          )}
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.valueText}>{user?.email || "N/A"}</Text>
          )}
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="AAAA/MM/DD"
            />
          ) : (
            <Text style={styles.valueText}>
              {user?.fecha_nacimiento || "N/A"}
            </Text>
          )}
        </View>

        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  infoGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonRow: {
    gap: 10,
    marginTop: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#4f46e5",
  },
  saveButton: {
    backgroundColor: "#16a34a",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
  },
  logoutButton: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Home;