"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";

type MockSession = { fullName: string; identifier: string };
const AUTH_STORAGE_KEY = "mock-auth-session";
const AUTH_EVENT_NAME = "mock-auth-change";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleSuccess = (session: MockSession) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    dispatchAuthChange();

    const redirect = new URLSearchParams(window.location.search).get("redirect");
    const role = window.localStorage.getItem("admin_role") || window.localStorage.getItem("user_role");
    const isStaff = role === "Admin" || role === "Editor";

    if (isStaff) {
      // luôn vào khu admin; nếu có redirect /admin/... thì đi theo
      const target = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

      // delay 0ms để cookie `admin_token` chắc chắn đã được ghi trước request /admin
      window.setTimeout(() => window.location.replace(target), 0);
      return;
    }

    window.location.replace("/trang-ca-nhan");
  };

  const dispatchAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(185,28,28,0.08),_transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_25%,rgba(248,250,252,0.95)_25%,rgba(248,250,252,0.95)_50%,rgba(255,255,255,0.88)_50%,rgba(255,255,255,0.88)_75%,rgba(248,250,252,0.95)_75%,rgba(248,250,252,0.95)_100%)] bg-[length:26px_26px] opacity-55" />

      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-sm sm:p-7">
        <AuthHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {activeTab === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}

        <SocialLogin />
      </section>
    </main>
  );
}
