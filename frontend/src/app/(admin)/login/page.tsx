"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import api from "@/services/api";

type BackendErrorPayload =
  | string
  | {
      message?: string;
      error?: string;
      title?: string;
      detail?: string;
    };

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRedirectPath = () => {
    if (typeof window === "undefined") {
      return "/admin";
    }

    const redirect = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    return redirect && redirect.startsWith("/admin") ? redirect : "/admin";
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Vui long nhap day du ten dang nhap va mat khau.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      const token: string | undefined = res.data?.token;
      const role: string | undefined = res.data?.role;
      const displayName: string = res.data?.username || username.trim();

      if (!token) {
        setError("Dang nhap that bai. Khong nhan duoc token.");
        return;
      }

      // Optional: only allow Admin/Editor into admin area
      if (role && !["Admin", "Editor"].includes(role)) {
        setError("Tai khoan khong co quyen truy cap quan tri.");
        return;
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_display_name", displayName);
      if (role) localStorage.setItem("admin_role", role);
      document.cookie = `admin_token=${token}; Path=/; Max-Age=86400; SameSite=Lax`;

      router.replace(getRedirectPath());
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorPayload>(err)) {
        const data = err.response?.data;
        const serverMessage =
          typeof data === "string"
            ? data
            : data?.message || data?.error || data?.title || data?.detail;
        setError(
          serverMessage ||
            "Dang nhap that bai. Vui long kiem tra tai khoan/mat khau.",
        );
      } else {
        setError("Dang nhap that bai. Vui long thu lai.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-900">
        Dang nhap quan tri
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Dang nhap bang tai khoan quan tri.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Ten dang nhap
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Nhap ten dang nhap"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Mat khau
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 pr-10 text-sm outline-none focus:border-emerald-600"
              placeholder="Nhap mat khau"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Dang dang nhap..." : "Dang nhap"}
        </button>
      </form>
    </section>
  );
}
