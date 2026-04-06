"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, FolderOpen, LogOut, Mail, MapPin, Phone, UserCircle2 } from "lucide-react";

import type { User } from "@/types";

type ProfileSidebarProps = {
  user: User;
  applicationCount: number;
  applicationLookupQuery?: string;
  onLogout: () => void;
};

function getInitials(fullName?: string) {
  return (fullName || "Người dùng")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileSidebar({
  user,
  applicationCount,
  applicationLookupQuery = "",
  onLogout,
}: ProfileSidebarProps) {
  const displayName = user.fullName?.trim() || user.username;

  return (
    <aside className="w-full md:w-72 md:flex-shrink-0">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm md:sticky md:top-32">
        <div className="relative border-b border-slate-100 px-6 pb-6 pt-8 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white" />
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-md">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" unoptimized sizes="96px" />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{user.username}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            <BadgeCheck className="h-4 w-4" />
            Tài khoản đã xác thực
          </div>
          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>{user.phone || "Chưa cập nhật số điện thoại"}</span>
            </div>
            <div className="flex items-start gap-3">
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 p-3">
          <Link
            href="/trang-ca-nhan"
            className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          >
            <span className="flex items-center gap-3">
              <UserCircle2 className="h-5 w-5" />
              Hồ sơ cá nhân
            </span>
          </Link>
          <Link
            href={`/dich-vu/tra-cuu${applicationLookupQuery}`}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5" />
              Hồ sơ dịch vụ công
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{applicationCount}</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </nav>
      </div>
    </aside>
  );
}
