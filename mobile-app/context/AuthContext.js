import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    const receivedToken = response.data.token;
    const receivedUser = response.data.user;

    await AsyncStorage.setItem("token", receivedToken);

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const loadUserFromToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      setToken(savedToken);
      setUser(response.data);
    } catch (error) {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    if (!token) return null;

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(response.data);
    return response.data;
  };

  const updateProfile = async (userId, updatedData) => {
    const response = await api.put(`/users/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(response.data.user);
    return response.data;
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        getProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};