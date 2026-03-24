"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import api from "@/services/api";
const DEMO_ACCOUNT = {
  identifier: "demo@caolanh.gov.vn",
  password: "123456",
  fullName: "Nguyễn Văn A",
};

type LoginFormProps = {
  onSuccess: (session: { fullName: string; identifier: string }) => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const username = loginForm.identifier.trim();
    const password = loginForm.password;

    if (!username || !password) {
      setErrorMessage("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      const token: string | undefined = res.data?.token;
      const role: string | undefined = res.data?.role;
      const returnedUsername: string | undefined = res.data?.username;
      const returnedFullName: string | undefined = res.data?.fullName;

      if (!token || !returnedUsername) {
        setErrorMessage("Đăng nhập thất bại (thiếu token).");
        return;
      }

      const displayName = returnedFullName ?? returnedUsername;

      // Lưu cho user-side (Header/trang cá nhân vẫn dùng mock session)
      localStorage.setItem("user_token", token);
      localStorage.setItem("user_role", role ?? "");
      localStorage.setItem("user_username", returnedUsername);

      const clearAdminSession = () => {
        localStorage.removeItem("admin_role");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_display_name");
        document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Lax";
        document.cookie = "admin_role=; Path=/; Max-Age=0; SameSite=Lax";
      };

      // Quan trọng: bật quyền admin cho middleware
      if (role === "Admin" || role === "Editor") {
        localStorage.setItem("admin_role", role);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_display_name", displayName);
        document.cookie = `admin_token=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax`;
        document.cookie = `admin_role=${encodeURIComponent(role)}; Path=/; Max-Age=86400; SameSite=Lax`;
      } else {
        // Tránh trường hợp trước đó từng login admin, cookie vẫn còn.
        clearAdminSession();
      }

      onSuccess({ fullName: displayName, identifier: returnedUsername });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMessage("Sai tài khoản hoặc mật khẩu.");
      } else {
        setErrorMessage("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitButtonClassName = isLoading
    ? "mt-1 flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-red-400 px-4 py-2.5 text-sm font-semibold text-white opacity-90"
    : "mt-1 flex w-full items-center justify-center rounded-lg bg-[#8b1d1d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#741717]";

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="identifier"
        >
          Tên đăng nhập
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          value={loginForm.identifier}
          onChange={(event) =>
            setLoginForm((prev) => ({
              ...prev,
              identifier: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
          placeholder="Nhập email hoặc tên đăng nhập"
          required
        />

        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="loginPassword"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="loginPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
            placeholder="Nhập mật khẩu"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
            aria-label="Ẩn hoặc hiện mật khẩu"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="pt-1 text-right">
          <button
            type="button"
            className="text-sm font-medium text-[#8b1d1d] hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={submitButtonClassName}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>

        <p className="mt-4 px-4 text-center text-xs leading-relaxed text-gray-500">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <a
            href="#"
            className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline"
          >
            Điều khoản dịch vụ
          </a>
          &{" "}
          <a
            href="#"
            className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline"
          >
            Chính sách bảo mật
          </a>
          .
        </p>
      </form>
    </>
  );
}
