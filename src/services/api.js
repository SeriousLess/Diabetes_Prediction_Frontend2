import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // ⚠️ en producción cambia a tu backend de Render
});

// Interceptor: agrega el token automáticamente si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;