import axios from "axios";
import API_URL from "../config";

const API = axios.create({
  baseURL: API_URL, // 👈 Ahora toma el valor correcto (Render en producción, localhost en dev)
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