"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProcedures } from "@/services/serviceService";
import type { ProcedureDetail } from "@/types/service";

export default function ServiceSidebar() {
  const [procedures, setProcedures] = useState<ProcedureDetail[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadProcedures = async () => {
      const data = await getProcedures();
      if (isMounted) {
        setProcedures(data.slice(0, 3));
      }
    };

    void loadProcedures();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-emerald-700/10 bg-emerald-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-emerald-700">search</span>
          <h3 className="font-bold tracking-tight text-slate-900">Tra cuu ho so</h3>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Kiem tra tinh trang xu ly ho so bang so dien thoai va email da dung khi nop.
          </p>
          <Link
            href="/dich-vu/tra-cuu"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-900"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            Den trang tra cuu
          </Link>
          <Link
            href="/dich-vu/nop-ho-so"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Nop ho so moi
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-blue-700/10 bg-blue-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-blue-700">description</span>
          <h3 className="font-bold tracking-tight text-slate-900">Thu tuc duoc quan tam</h3>
        </div>
        <div className="space-y-1 p-3">
          {procedures.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Dang tai danh sach thu tuc...
            </div>
          ) : (
            procedures.map((procedure) => (
              <Link
                key={procedure.slug}
                href={`/dich-vu/chi-tiet-ho-so/${procedure.slug}`}
                className="group flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <span className="material-symbols-outlined text-[20px]">article</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 transition-colors group-hover:text-[#1f7a5a]">
                    {procedure.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{procedure.processingTime}</div>
                </div>
              </Link>
            ))
          )}

          <Link
            href="/dich-vu/nop-ho-so"
            className="mt-2 block w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-black uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1f7a5a]"
          >
            Xem tat ca thu tuc
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f7a5a] to-[#14523b] p-6 text-white shadow-md">
        <div className="absolute -right-6 -top-6 text-white/10">
          <span className="material-symbols-outlined select-none text-9xl">support_agent</span>
        </div>
        <div className="relative z-10">
          <h3 className="mb-2 text-lg font-bold tracking-wide">Can ho tro?</h3>
          <p className="mb-5 text-sm leading-relaxed text-emerald-50/90">
            Lien he tong dai hoac quay ve muc dich vu de chon dung thu tuc truoc khi nop ho so.
          </p>
          <div className="space-y-3">
            <a
              href="tel:19001234"
              className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm transition hover:bg-white/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Hotline</span>
                <span className="text-xl font-black tracking-wide text-white">1900 1234</span>
              </div>
            </a>
            <Link
              href="/lien-he"
              className="flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Xem thong tin lien he
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
