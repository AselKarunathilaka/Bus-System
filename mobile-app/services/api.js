import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://bus-system-3lgy.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;