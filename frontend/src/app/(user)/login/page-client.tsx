"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";
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

  useEffect(() => {
    const adminToken = window.localStorage.getItem("admin_token");
    const userToken = window.localStorage.getItem(USER_TOKEN_KEY);

    if (safeAdminRedirect && adminToken) {
      router.replace(safeAdminRedirect);
      return;
    }

    if (!safeAdminRedirect && userToken) {
      router.replace("/trang-ca-nhan");
    }
  }, [router, safeAdminRedirect]);

  const handleAuthSuccess = async (payload: LoginSuccessPayload) => {
    const isAdmin = payload.role ? ["Admin", "Editor"].includes(payload.role) : false;
    const displayName = payload.fullName?.trim() || payload.username;

    if (isAdmin) {
      window.localStorage.setItem("admin_token", payload.token);
      window.localStorage.setItem("admin_display_name", displayName);
      if (payload.role) {
        window.localStorage.setItem("admin_role", payload.role);
      }
      document.cookie = `admin_token=${payload.token}; Path=/; Max-Age=86400; SameSite=Lax`;
      router.replace(safeAdminRedirect ?? "/admin");
      return;
    }

    window.localStorage.setItem(USER_TOKEN_KEY, payload.token);

    try {
      const currentUser = await fetchCurrentUser();
      const session: UserSession = {
        username: currentUser.username,
        fullName: currentUser.fullName || currentUser.username,
        role: currentUser.role?.name,
        email: currentUser.email,
        phone: currentUser.phone,
      };
      writeUserSession(session);
    } catch {
      const fallbackSession: UserSession = {
        username: payload.username,
        fullName: displayName,
        role: payload.role,
      };
      writeUserSession(fallbackSession);
    }

    router.replace("/trang-ca-nhan");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(185,28,28,0.08),_transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_25%,rgba(248,250,252,0.95)_25%,rgba(248,250,252,0.95)_50%,rgba(255,255,255,0.88)_50%,rgba(255,255,255,0.88)_75%,rgba(248,250,252,0.95)_75%,rgba(248,250,252,0.95)_100%)] bg-[length:26px_26px] opacity-55" />

      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-sm sm:p-7">
        <AuthHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "login" ? (
          <LoginForm onSuccess={handleAuthSuccess} adminRedirectPath={safeAdminRedirect} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}

        <SocialLogin />
      </section>
    </main>
  );
}
