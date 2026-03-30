import axios, { AxiosHeaders } from "axios";

import { API_BASE_URL, getRemoteBasicAuthHeader } from "@/lib/api-base-url";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const headers = AxiosHeaders.from(config.headers);

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "application/json");
    }
    if (typeof window !== "undefined") {
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      const adminToken = localStorage.getItem("admin_token");
      const userToken = localStorage.getItem("user_token");
      const token = isAdminRoute ? adminToken || userToken : userToken || adminToken;
      const headers = AxiosHeaders.from(config.headers);

      if (token) {
        headers.set("X-Admin-Authorization", `Bearer ${token}`);
      }

      config.headers = headers;

      return config;
    }

    const basicAuthHeader = getRemoteBasicAuthHeader();
    if (basicAuthHeader) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", basicAuthHeader);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url || "");
    const isAuthLoginRequest = requestUrl.includes("/auth/login");
    const authChallengeHeader = String(error.response?.headers?.["www-authenticate"] || "");
    const isServerLevelBasicAuth = authChallengeHeader.toLowerCase().includes("basic");

    if (error.response?.status === 401 && !isAuthLoginRequest && !isServerLevelBasicAuth) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("admin_display_name");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_session");
        document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Lax";
        const nextRedirect =
          window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/trang-ca-nhan")
            ? window.location.pathname
            : "/login";
        window.location.href = `/login?redirect=${encodeURIComponent(nextRedirect)}`;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
