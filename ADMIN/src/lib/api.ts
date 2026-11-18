import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  // Fail loudly instead of leaving the UI stuck on a spinner forever.
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
