"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type RegisterFormProps = {
  onSuccess: (session: { fullName: string; identifier: string }) => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    window.setTimeout(() => {
      if (registerForm.password !== registerForm.confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không khớp. Bạn kiểm tra lại giúp mình nhé.");
        setIsLoading(false);
        return;
      }

      onSuccess({
        fullName: registerForm.fullName || "Nguyễn Văn A",
        identifier: registerForm.email || registerForm.username,
      });
      setIsLoading(false);
    }, 2000);
  };

  const submitButtonClassName = isLoading
    ? "mt-1 flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-red-400 px-4 py-2.5 text-sm font-semibold text-white opacity-90"
    : "mt-1 flex w-full items-center justify-center rounded-lg bg-[#8b1d1d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#741717]";

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
          Họ và tên
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={registerForm.fullName}
          onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
          placeholder="Nhập họ và tên"
          required
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="username">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={registerForm.username}
          onChange={(event) => setRegisterForm((prev) => ({ ...prev, username: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
          placeholder="Nhập tên đăng nhập"
          required
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="registerEmail">
          Email
        </label>
        <input
          id="registerEmail"
          name="email"
          type="email"
          value={registerForm.email}
          onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
          placeholder="Nhập email"
          required
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="registerPassword">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="registerPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerForm.password}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
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
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={registerForm.confirmPassword}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#8b1d1d] focus:ring-2 focus:ring-[#8b1d1d]/20"
            placeholder="Nhập lại mật khẩu"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
            aria-label="Ẩn hoặc hiện mật khẩu xác nhận"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <button type="submit" disabled={isLoading} className={submitButtonClassName}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng ký tài khoản"
          )}
        </button>

        <p className="mt-4 px-4 text-center text-xs leading-relaxed text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Điều khoản dịch vụ
          </a>
          &{" "}
          <a href="#" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Chính sách bảo mật
          </a>
          .
        </p>
      </form>
    </>
  );
}
