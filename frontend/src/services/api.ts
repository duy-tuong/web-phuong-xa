import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7065/api",
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const headers = AxiosHeaders.from(config.headers);

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "application/json");
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token") ?? localStorage.getItem("user_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("admin_display_name");
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_username");
        document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Lax";
        document.cookie = "admin_role=; Path=/; Max-Age=0; SameSite=Lax";
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
