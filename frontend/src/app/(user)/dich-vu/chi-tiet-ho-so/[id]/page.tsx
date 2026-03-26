"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ServiceDetailFormSection from "@/components/dich-vu/ServiceDetailFormSection";
import ServiceDetailSidebar from "@/components/dich-vu/ServiceDetailSidebar";
import { getProcedures } from "@/services/serviceService";
import type { ProcedureDetail } from "@/types/service";

export default function DichVuDetailPage() {
  const params = useParams<{ id: string }>();
  const routeId = typeof params?.id === "string" ? params.id : "";
  const [procedures, setProcedures] = useState<ProcedureDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProcedures = async () => {
      try {
        const nextProcedures = await getProcedures();
        if (!isMounted) {
          return;
        }

        setProcedures(nextProcedures);
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

  const selectedProcedure = useMemo(
    () => procedures.find((item) => item.slug === routeId),
    [procedures, routeId],
  );

  const selectedProcedureTitle = selectedProcedure?.title ?? "Thu tuc dang chon";

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">Dang tai bieu mau va thong tin ho so...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-gradient-to-br from-[#1f7a5a]/5 to-[#db2777]/5 py-8 lg:py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="max-w-2xl">
            <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#1f7a5a]">
                Trang chu
              </Link>
              <span>&gt;</span>
              <Link href="/dich-vu" className="hover:text-[#1f7a5a]">
                Dich vu hanh chinh
              </Link>
              <span>&gt;</span>
              <span className="font-medium text-slate-900">Nop ho so</span>
              <span>&gt;</span>
              <span className="font-medium text-slate-900">{selectedProcedureTitle}</span>
            </nav>

            <h2 className="mb-2 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Nop ho so truc tuyen
            </h2>
            <p className="mb-3 text-base font-semibold text-[#1f7a5a]">Loai ho so: {selectedProcedureTitle}</p>
            <p className="max-w-xl text-lg text-slate-600">
              Giai quyet thu tuc hanh chinh nhanh chong, minh bach va hieu qua. Tiet kiem thoi gian cho cong dan va doanh nghiep tai Phuong Cao Lanh.
            </p>
          </div>
          <div className="hidden size-48 rounded-full bg-gradient-to-tr from-[#1f7a5a]/20 to-[#db2777]/20 blur-3xl opacity-60 md:block" />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <ServiceDetailFormSection id={routeId} procedure={selectedProcedure} />
          <ServiceDetailSidebar />
        </div>
      </section>
    </main>
  );
}
