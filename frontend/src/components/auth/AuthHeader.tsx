//Component hiển thị tiêu đề, logo, hoặc thông tin hướng dẫn ở đầu các trang đăng nhập/đăng ký.
"use client";

import { useMemo } from "react";

type AuthTab = "login" | "register";

type AuthHeaderProps = {
  activeTab: AuthTab;
  setActiveTab: (tab: AuthTab) => void;
};

export default function AuthHeader({ activeTab, setActiveTab }: AuthHeaderProps) {
  const authHeading = useMemo(
    () => (activeTab === "login" ? "Đăng nhập hệ thống" : "Đăng ký tài khoản"),
    [activeTab]
  );

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</p>
        <p className="mt-1 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">PHƯỜNG CAO LÃNH</p>
        <p className="mt-1 text-xs font-medium text-slate-600">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
        <h1 className="text-2xl font-bold text-slate-900">{authHeading}</h1>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            activeTab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            activeTab === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Đăng ký
        </button>
      </div>
    </>
  );
}
