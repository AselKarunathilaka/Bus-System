import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;