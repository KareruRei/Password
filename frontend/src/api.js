import axios from "axios";

const BASE = import.meta?.env?.VITE_API_BASE || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  return config;
});

// Global response handler: on 401 clear token and allow UI to handle redirect
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;