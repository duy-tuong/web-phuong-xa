"use client";

import { Google, Zalo } from "@thesvg/react";

export default function SocialLogin() {
  return (
    <>
      <div className="mb-5 mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Hoặc đăng nhập bằng</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => alert("Hệ thống đang chờ cấp phép kết nối cơ sở dữ liệu quốc gia về dân cư")}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#8b1d1d] bg-gradient-to-r from-[#8b1d1d] to-[#a92525] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#741717] hover:to-[#8b1d1d]"
        >
          <img src="/images/vneid-svgrepo-com.svg" alt="VNeID" className="h-5 w-5 rounded-sm bg-white/90 p-0.5" />
          Đăng nhập bằng VNeID
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Google className="h-5 w-5" />
            Đăng nhập với Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#0a65cc]/40 bg-[#0a65cc]/5 px-4 py-2.5 text-sm font-semibold text-[#0a65cc] transition hover:bg-[#0a65cc]/10"
          >
            <Zalo className="h-5 w-5" />
            Đăng nhập với Zalo
          </button>
        </div>
      </div>
    </>
  );
}
