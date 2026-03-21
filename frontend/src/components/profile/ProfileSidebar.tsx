"use client";

import { BadgeCheck, Bell, CreditCard, FolderOpen, LayoutDashboard, LogOut, MapPin, Settings, UserCircle2 } from "lucide-react";

type MockSession = {
  fullName: string;
  identifier: string;
};

const sidebarItems = [
  { label: "Tổng quan", icon: LayoutDashboard, active: true },
  { label: "Hồ sơ cá nhân", icon: UserCircle2 },
  { label: "Hồ sơ dịch vụ công", icon: FolderOpen, badge: "3" },
  { label: "Lịch sử thanh toán", icon: CreditCard },
  { label: "Thông báo", icon: Bell, badge: "2", accent: true },
  { label: "Cài đặt tài khoản", icon: Settings, separator: true },
];

export default function ProfileSidebar({ session, onLogout }: { session: MockSession, onLogout: () => void }) {
  return (
    <aside className="w-full md:w-72 md:flex-shrink-0">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm md:sticky md:top-32">
        <div className="relative border-b border-slate-100 px-6 pb-6 pt-8 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white" />
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-md">
            NA
          </div>
          <h1 className="text-xl font-bold text-slate-900">{session.fullName}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Công dân điện tử</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            <BadgeCheck className="h-4 w-4" />
            Tài khoản đã xác thực
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>Phường Cao Lãnh, Thành phố Cao Lãnh, Đồng Tháp</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition ${
                  item.active
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                } ${item.separator ? "mt-2 border-t border-slate-100 pt-5" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {item.label}
                </span>
                {item.badge ? (
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      item.accent ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </nav>
      </div>
    </aside>
  );
}
