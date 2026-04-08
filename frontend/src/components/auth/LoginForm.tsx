// ! Đăng nhập: Quản lý form, gửi request, xử lý phản hồi, hiển thị lỗi, và báo lên component cha khi thành công để lưu token và chuyển hướng.
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import api from "@/services/api";
// Định nghĩa kiểu dữ liệu trả về khi login thành công 
type LoginSuccessPayload = {
  token: string;
  username: string;
  fullName?: string;
  role?: string;
};
// Định nghĩa kiểu dữ liệu lỗi từ Backend trả về
type BackendErrorPayload =
  | string
  | {
      message?: string;
      error?: string;
      title?: string;
      detail?: string;
    };

type LoginFormProps = {
  onSuccessAction: (payload: LoginSuccessPayload) => void;
  adminRedirectPath?: string | null;
};

export default function LoginForm({ onSuccessAction, adminRedirectPath }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
// Kiểm tra xem người dùng có đang cố đăng nhập vào khu vực Admin hay không
  const isAdminFlow = Boolean(adminRedirectPath?.startsWith("/admin"));
//* Hàm xử lý chính khi người dùng bấm nút "Đăng nhập"
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn chặn hành vi reload trang mặc định của form
    setErrorMessage(""); // Xóa lỗi cũ trước khi thử lại

    const username = loginForm.identifier.trim();
    const password = loginForm.password;

    if (!username || !password) {
      setErrorMessage("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      //* GỌI API Ở ĐÂY: Gửi thông tin đăng nhập (username, password) lên endpoint /auth/login của backend.
      const response = await api.post("/auth/login", { username, password });
    // Lấy dữ liệu cần dùng từ phản hồi của backend.
      const token: string | undefined = response.data?.token;
      const returnedUsername: string | undefined = response.data?.username;
      const role: string | undefined = response.data?.role;
      const fullName: string | undefined = response.data?.fullName;
    // Nếu thiếu token hoặc username thì coi như đăng nhập chưa thành công.
      if (!token || !returnedUsername) {
        setErrorMessage("Đăng nhập thất bại. Không nhận được dữ liệu người dùng từ máy chủ.");
        return;
      }
  // Chỉ tài khoản Admin hoặc Editor mới được vào luồng quản trị.
      const isAdminRole = role ? ["Admin", "Editor"].includes(role) : false;
      if (isAdminFlow && !isAdminRole) {
        setErrorMessage("Tài khoản không có quyền truy cập khu vực quản trị.");
        return;
      }
  //* Báo lên component cha để lưu token và chuyển hướng.
      onSuccessAction({ token, username: returnedUsername, fullName, role });
    } catch (error: unknown) {
      if (axios.isAxiosError<BackendErrorPayload>(error)) {
          // Ưu tiên hiện lỗi backend trả về để người dùng dễ hiểu nguyên nhân.
        const data = error.response?.data;
        const serverMessage = typeof data === "string" ? data : data?.message || data?.error || data?.title || data?.detail;
        const normalizedMessage = (serverMessage || "").toLowerCase();
        if (normalizedMessage.includes("invalid username")) {
          setErrorMessage("Tên tài khoản không đúng");
        } else if (normalizedMessage.includes("invalid password")) {
          setErrorMessage("Mật khẩu không đúng");
        } else {
          setErrorMessage(
            serverMessage ||
              "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
          );
        }
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
        <label className="block text-sm font-medium text-slate-700" htmlFor="identifier">
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
          placeholder="Nhập tên đăng nhập"
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
          <Link href="/lien-he" className="text-sm font-medium text-[#8b1d1d] hover:underline">
            Cần hỗ trợ đăng nhập?
          </Link>
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
          <Link href="/gioi-thieu" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Điều khoản dịch vụ
          </Link>
          {" "}và{" "}
          <Link href="/lien-he" className="inline-block px-1 py-1 font-medium text-red-700 transition-colors hover:underline">
            Chính sách bảo mật
          </Link>
          .
        </p>
      </form>
    </>
  );
}
