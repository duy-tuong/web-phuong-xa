"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getProcedures } from "@/services/serviceService";
import type { ProcedureDetail } from "@/types/service";

export default function NopHoSoPage() {
  const [procedures, setProcedures] = useState<ProcedureDetail[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProcedures = async () => {
      try {
        const data = await getProcedures();
        if (isMounted) {
          setProcedures(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProcedures();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProcedures = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
      return procedures;
    }

    return procedures.filter((procedure) => {
      const haystacks = [
        procedure.title,
        procedure.processingTime,
        procedure.requirements.join(" "),
      ].join(" ").toLowerCase();

      return haystacks.includes(normalizedKeyword);
    });
  }, [keyword, procedures]);

  return (
    <section className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#1f7a5a]">
          Trang chu
        </Link>
        <span>&gt;</span>
        <Link href="/dich-vu" className="hover:text-[#1f7a5a]">
          Dich vu cong
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-slate-900">Nop ho so</span>
      </nav>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-8 text-white shadow-xl md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Cong dich vu cong
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Chon thu tuc de nop ho so</h1>
            <p className="mt-3 text-emerald-100/90 md:text-lg">
              Chon dung thu tuc dang can thuc hien, sau do dien thong tin co ban de he thong tao ma ho so cho ban.
            </p>
          </div>

          <Link
            href="/dich-vu/tra-cuu"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Tra cuu ho so da nop
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-bold text-slate-800" htmlFor="procedure-keyword">
          Tim thu tuc
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            id="procedure-keyword"
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Nhap ten thu tuc, yeu cau ho so, thoi gian xu ly..."
            className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">Dang tai danh sach thu tuc...</p>
        </div>
      ) : filteredProcedures.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Khong tim thay thu tuc phu hop</h2>
          <p className="mt-3 text-sm text-slate-600">
            Thu doi tu khoa khac hoac quay ve trang dich vu de xem toan bo danh muc.
          </p>
          <div className="mt-5">
            <Link
              href="/dich-vu"
              className="inline-flex items-center rounded-xl bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]"
            >
              Ve danh sach dich vu
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredProcedures.map((procedure) => (
            <Link
              key={procedure.slug}
              href={`/dich-vu/chi-tiet-ho-so/${procedure.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Thu tuc</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 transition group-hover:text-[#1f7a5a]">
                    {procedure.title}
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {procedure.processingTime}
                </span>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                {procedure.requirements.length > 0
                  ? `Thanh phan ho so: ${procedure.requirements.slice(0, 2).join("; ")}`
                  : "Thong tin thanh phan ho so dang duoc cap nhat."}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="font-semibold text-slate-500">Le phi: {procedure.fee}</span>
                <span className="font-bold text-[#1f7a5a]">Chon thu tuc</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
