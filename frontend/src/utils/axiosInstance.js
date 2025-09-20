// api/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 🔑 always send cookies
});

export default api;