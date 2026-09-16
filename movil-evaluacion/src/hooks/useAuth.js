import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { database } from "../config/firebase.js"; // Tu archivo firebase.js

// Estado global en memoria
let globalAuthState = {
  user: null,
  token: null,
  loadingAuth: true,
};

const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalAuthState));
};

// Carga inicial del token/sesión guardada
const loadInitialStorage = async () => {
  try {
    const storedUser = await SecureStore.getItemAsync("user");
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedUser && storedToken) {
      globalAuthState = {
        user: JSON.parse(storedUser),
        token: storedToken,
        loadingAuth: false,
      };
    } else {
      globalAuthState = { ...globalAuthState, loadingAuth: false };
    }
  } catch (error) {
    console.error("Error al recuperar sesión:", error);
    globalAuthState = { ...globalAuthState, loadingAuth: false };
  }
  notifyListeners();
};

loadInitialStorage();

export const useAuth = () => {
  const [authState, setAuthState] = useState(globalAuthState);

  useEffect(() => {
    listeners.add(setAuthState);
    return () => listeners.delete(setAuthState);
  }, []);

  // Función de Login que busca directamente en la colección 'users' de Firestore
  const login = async (email, password) => {
    try {
      const usersRef = collection(database, "users");
      
      // Consulta en Firestore filtrando por email y password
      const q = query(
        usersRef,
        where("email", "==", email.trim().toLowerCase()),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Email o contraseña incorrectos.");
      }

      // Tomamos el primer documento que coincida
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };
      
      const fakeToken = `token-${userData.id}-${Date.now()}`;

      // Persistimos los datos localmente
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      await SecureStore.setItemAsync("token", fakeToken);

      globalAuthState = {
        user: userData,
        token: fakeToken,
        loadingAuth: false,
      };

      notifyListeners();
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Función para modificar los datos del perfil en Firestore
  const updateUserData = async (updatedFields) => {
    if (!authState.user?.id) return;

    try {
      const userRef = doc(database, "users", authState.user.id);
      await updateDoc(userRef, updatedFields);

      const newUserState = { ...authState.user, ...updatedFields };

      await SecureStore.setItemAsync("user", JSON.stringify(newUserState));

      globalAuthState = {
        ...globalAuthState,
        user: newUserState,
      };

      notifyListeners();
    } catch (error) {
      console.error("Error actualizando perfil en Firestore:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");

      globalAuthState = {
        user: null,
        token: null,
        loadingAuth: false,
      };

      notifyListeners();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    loadingAuth: authState.loadingAuth,
    login,
    updateUserData,
    logout,
  };
};