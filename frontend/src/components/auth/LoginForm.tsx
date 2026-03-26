"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import api from "@/services/api";

type LoginSuccessPayload = {
  token: string;
  username: string;
  role?: string;
};

type BackendErrorPayload =
  | string
  | {
      message?: string;
      error?: string;
      title?: string;
      detail?: string;
    };

type LoginFormProps = {
  onSuccess: (payload: LoginSuccessPayload) => void;
  adminRedirectPath?: string | null;
};

export default function LoginForm({ onSuccess, adminRedirectPath }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAdminFlow = Boolean(adminRedirectPath?.startsWith("/admin"));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: loginForm.identifier.trim(),
        password: loginForm.password,
      });

      const token: string | undefined = response.data?.token;
      const username: string | undefined = response.data?.username;
      const role: string | undefined = response.data?.role;

      if (!token || !username) {
        setErrorMessage("Dang nhap that bai. Khong nhan duoc du lieu nguoi dung tu may chu.");
        return;
      }

      const isAdminRole = role ? ["Admin", "Editor"].includes(role) : false;
      if (isAdminFlow && !isAdminRole) {
        setErrorMessage("Tai khoan khong co quyen truy cap khu vuc quan tri.");
        return;
      }

      onSuccess({
        token,
        username,
        role,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError<BackendErrorPayload>(error)) {
        const data = error.response?.data;
        const serverMessage =
          typeof data === "string"
            ? data
            : data?.message || data?.error || data?.title || data?.detail;
        setErrorMessage(serverMessage || "Dang nhap that bai. Vui long kiem tra lai tai khoan hoac mat khau.");
      } else {
        setErrorMessage("Dang nhap that bai. Vui long thu lai.");
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
      {isAdminFlow ? (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-900">
          <p className="font-semibold">Dang nhap de truy cap khu vuc quan tri</p>
          <p className="mt-1">Chi tai khoan co quyen Admin hoac Editor moi duoc vao trang quan tri.</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700" htmlFor="identifier">
          Ten dang nhap
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          value={loginForm.identifier}
          onChange={(event) => setLoginForm((prev) => ({ ...prev, identifier: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
          placeholder="Nhap ten dang nhap"
          required
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="loginPassword">
          Mat khau
        </label>
        <div className="relative">
          <input
            id="loginPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginForm.password}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
            placeholder="Nhap mat khau"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
            aria-label="An hoac hien mat khau"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="pt-1 text-right">
          <Link href="/lien-he" className="text-sm font-medium text-[#8b1d1d] hover:underline">
            Can ho tro dang nhap?
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className={submitButtonClassName}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Dang xu ly...
            </>
          ) : (
            "Dang nhap"
          )}
        </button>

        <p className="mt-4 px-4 text-center text-xs leading-relaxed text-gray-500">
          Bang viec dang nhap, ban dong y voi{" "}
          <Link href="/gioi-thieu" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Thong tin don vi
          </Link>
          {" "}va{" "}
          <Link href="/lien-he" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Kenh lien he ho tro
          </Link>
          .
        </p>
      </form>
    </>
  );
}
