import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://bus-system-3lgy.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach JWT token to all outgoing requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to read token for interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;