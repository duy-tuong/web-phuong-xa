//! Công dụng:Quản lý tab Đăng nhập/Đăng ký.Kiểm tra token sẵn có và redirect.Nhận kết quả thành công từ form rồi lưu session/token + chuyển trang.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";
// Gọi API lấy thông tin chi tiết user
import { fetchCurrentUser } from "@/services/admin/profile";
import {
  USER_TOKEN_KEY,
  type UserSession,
  writeUserSession,
} from "@/lib/user-session";

type LoginSuccessPayload = {
  token: string;
  username: string;
  fullName?: string;
  role?: string;
};
// Hàm lấy đường dẫn chuyển hướng cho admin an toàn từ URL (nếu có)
function getSafeAdminRedirect() {
  if (typeof window === "undefined") {
    return null;
  }

  const redirectParam = new URLSearchParams(window.location.search).get("redirect");
  return redirectParam && redirectParam.startsWith("/admin") ? redirectParam : null;
}

export default function LoginPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [safeAdminRedirect] = useState<string | null>(() => getSafeAdminRedirect());
//! LUỒNG 1: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP SẴN KHI VỪA VÀO TRANG
  useEffect(() => {
    const adminToken = window.localStorage.getItem("admin_token");
    const userToken = window.localStorage.getItem(USER_TOKEN_KEY);
// Nếu đã đăng nhập Admin trước đó -> Đá thẳng vào trang Admin
    if (safeAdminRedirect && adminToken) {
      router.replace(safeAdminRedirect);
      return;
    }
// Nếu đã có token người dùng bình thường → chuyển đến trang cá nhân
    if (!safeAdminRedirect && userToken) {
      router.replace("/trang-ca-nhan"); 
    }
  }, [router, safeAdminRedirect]);
//! LUỒNG 2: XỬ LÝ NGAY SAU KHI FORM BÁO ĐĂNG NHẬP THÀNH CÔNG
  const handleAuthSuccess = async (payload: LoginSuccessPayload) => {
    // Kiểm tra xem tài khoản này có phải là quản trị viên không
    const isAdmin = payload.role ? ["Admin", "Editor"].includes(payload.role) : false;
    const displayName = payload.fullName?.trim() || payload.username;

    if (isAdmin) {
     //* Nếu login admin → lưu token vào localStorage  
      window.localStorage.setItem("admin_token", payload.token);
      // ! Lưu tên hiển thị admin
      window.localStorage.setItem("admin_display_name", displayName);
      if (payload.role) {
        window.localStorage.setItem("admin_role", payload.role);
      }
      //!lưu token vào cookie để middleware Next.js kiểm tra quyền admin
      document.cookie = `admin_token=${payload.token}; Path=/; Max-Age=86400; SameSite=Lax`;
      if (payload.role) {
        document.cookie = `admin_role=${payload.role}; Path=/; Max-Age=86400; SameSite=Lax`;
      }
      try {
        // Gọi API fetchCurrentUser() để lấy avatar và tên thật mới nhất
        const currentUser = await fetchCurrentUser();
        const nextAvatar = currentUser.avatarUrl?.trim();
        if (nextAvatar) {
          window.localStorage.setItem("admin_avatar", nextAvatar);
        }
        if (currentUser.fullName?.trim()) {
          window.localStorage.setItem(
            "admin_display_name",
            currentUser.fullName.trim(),
          );
        }
        window.dispatchEvent(new Event("admin-profile-updated"));
      } catch {
        
      }
      //* login thành công → chuyển sang trang admin
      router.replace(safeAdminRedirect ?? "/admin");
      return;
    }
//* --- NẾU LÀ USER BÌNH THƯỜNG ---
    // Lưu token user vào localStorage
    window.localStorage.setItem(USER_TOKEN_KEY, payload.token);

    try {
      // Gọi API fetchCurrentUser() để lấy toàn bộ thông tin chi tiết của user
      const currentUser = await fetchCurrentUser();
      const session: UserSession = {
        username: currentUser.username,
        fullName: currentUser.fullName || currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        role: currentUser.role?.name,
        email: currentUser.email,
        phone: currentUser.phone,
      };
      // Lưu session để UI hiển thị thông tin
      writeUserSession(session);
    } catch {
      const fallbackSession: UserSession = {
        username: payload.username,
        fullName: displayName,
        role: payload.role,
      };
      writeUserSession(fallbackSession);
    }
//! Nếu login thành công → chuyển đến trang cá nhân
    router.replace("/trang-ca-nhan"); 
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(185,28,28,0.08),_transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_25%,rgba(248,250,252,0.95)_25%,rgba(248,250,252,0.95)_50%,rgba(255,255,255,0.88)_50%,rgba(255,255,255,0.88)_75%,rgba(248,250,252,0.95)_75%,rgba(248,250,252,0.95)_100%)] bg-[length:26px_26px] opacity-55" />

      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-sm sm:p-7">
        <AuthHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "login" ? (
          <LoginForm onSuccessAction={handleAuthSuccess} adminRedirectPath={safeAdminRedirect} />
        ) : (
          <RegisterForm onSuccessAction={handleAuthSuccess} />
        )}

        <SocialLogin />
      </section>
    </main>
  );
}
