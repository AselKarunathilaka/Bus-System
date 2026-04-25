import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: make sure this DOES NOT end with /api/api
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://bus-system-3lgy.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REQUEST INTERCEPTOR (ADD TOKEN)
// ==============================
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // DEBUG (important for your issue)
      console.log("➡️ API Request:", config.method?.toUpperCase(), config.url);

    } catch (err) {
      console.log("Token error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR (ERROR LOG)
// ==============================
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url);
    return response;
  },
  (error) => {
    console.log(
      "❌ API Error:",
      error?.response?.status,
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;