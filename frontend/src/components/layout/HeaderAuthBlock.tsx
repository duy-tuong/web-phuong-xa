import { type RefObject } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import type { UserSession } from "@/lib/user-session";

type HeaderAuthBlockProps = {
  initials: string;
  session: UserSession | null;
  showUserMenu: boolean;
  userMenuRef: RefObject<HTMLDivElement | null>;
  onToggleUserMenu: () => void;
  onCloseMenus: () => void;
  onLogout: () => void;
};

export default function HeaderAuthBlock({
  initials,
  session,
  showUserMenu,
  userMenuRef,
  onToggleUserMenu,
  onCloseMenus,
  onLogout,
}: HeaderAuthBlockProps) {
  if (!session) {
    return (
      <Link href="/login" className="rounded-md bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-800">
        Đăng nhập
      </Link>
    );
  }

  return (
    <div ref={userMenuRef} className="relative">
      <button
        type="button"
        onClick={onToggleUserMenu}
        className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white/95 px-2 py-1.5 text-slate-700 shadow-sm transition hover:border-emerald-300"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-sm font-medium lg:block">{session.fullName}</span>
        <ChevronDown className={`hidden h-4 w-4 text-slate-500 transition lg:block ${showUserMenu ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute right-0 top-full z-[140] mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
          showUserMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <Link
          href="/trang-ca-nhan"
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
          onClick={onCloseMenus}
        >
          Tai khoan cua toi
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          Dang xuat
        </button>
      </div>
    </div>
  );
}
