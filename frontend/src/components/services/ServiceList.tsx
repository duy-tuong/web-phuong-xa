"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getProcedures } from "@/services/serviceService";
import type { ProcedureDetail } from "@/types/service";
import ServiceCard, { type ServiceCardData } from "./ServiceCard";

function inferField(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("khai sinh") || normalized.includes("khai tu") || normalized.includes("ket hon")) {
    return "Ho tich";
  }

  if (normalized.includes("kinh doanh")) {
    return "Kinh doanh";
  }

  if (normalized.includes("dat") || normalized.includes("nha") || normalized.includes("bat dong san")) {
    return "Dat dai";
  }

  return "Hanh chinh cong";
}

function toFieldValue(field: string) {
  return field
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLevelData(procedure: ProcedureDetail) {
  if (procedure.wordTemplateHref && procedure.wordTemplateHref !== "#") {
    return {
      level: "Muc do 4",
      levelClass: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    level: "Muc do 3",
    levelClass: "border-orange-200 bg-orange-50 text-orange-700",
  };
}

function buildServiceDescription(procedure: ProcedureDetail) {
  const topRequirements = procedure.requirements.slice(0, 2);
  if (topRequirements.length === 0) {
    return "Thong tin thanh phan ho so dang duoc cap nhat tu he thong dich vu cong.";
  }

  return `Ho so can chuan bi: ${topRequirements.join("; ")}.`;
}

function mapProcedureToCard(procedure: ProcedureDetail, index: number): ServiceCardData {
  const { level, levelClass } = getLevelData(procedure);

  return {
    slug: procedure.slug,
    profileCode: procedure.id ? `DV-${String(procedure.id).padStart(3, "0")}` : `DV-${String(index + 1).padStart(3, "0")}`,
    level,
    levelClass,
    field: inferField(procedure.title),
    title: procedure.title,
    description: buildServiceDescription(procedure),
    duration: procedure.processingTime,
    fee: procedure.fee,
  };
}

type SortMode = "default" | "name" | "duration";

export default function ServiceList() {
  const searchParams = useSearchParams();
  const [procedures, setProcedures] = useState<ProcedureDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("default");

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

  const services = useMemo(() => procedures.map(mapProcedureToCard), [procedures]);
  const keyword = (searchParams.get("q") ?? "").trim().toLowerCase();
  const field = searchParams.get("field") ?? "";

  const filteredServices = useMemo(() => {
    const nextServices = services.filter((service) => {
      const matchesKeyword =
        !keyword ||
        service.title.toLowerCase().includes(keyword) ||
        service.description.toLowerCase().includes(keyword) ||
        service.field.toLowerCase().includes(keyword);

      const matchesField = !field || toFieldValue(service.field) === field;

      return matchesKeyword && matchesField;
    });

    if (sortMode === "name") {
      return [...nextServices].sort((left, right) => left.title.localeCompare(right.title, "vi"));
    }

    if (sortMode === "duration") {
      return [...nextServices].sort((left, right) => left.duration.localeCompare(right.duration, "vi"));
    }

    return nextServices;
  }, [field, keyword, services, sortMode]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">Dang tai danh sach thu tuc...</p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex w-full flex-col space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Chua co dich vu cong nao</h2>
          <p className="mt-3 text-sm text-slate-600">
            He thong chua co du lieu thu tuc hanh chinh de hien thi. Khi backend co du lieu, danh sach se tu dong cap nhat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900">
            Danh sach thu tuc
            <span className="flex h-7 items-center justify-center rounded-full bg-emerald-100 px-3 text-sm font-black text-[#1f7a5a]">
              {filteredServices.length}
            </span>
          </h2>
          {(keyword || field) && (
            <p className="mt-2 text-sm text-slate-500">
              Dang hien thi ket qua phu hop voi bo loc ban da chon.
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm sm:w-auto md:justify-end md:gap-3">
          <span className="font-semibold text-slate-500">Sap xep theo:</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="cursor-pointer appearance-none border-none bg-transparent font-bold text-[#1f7a5a] outline-none"
          >
            <option value="default">Mac dinh</option>
            <option value="name">Ten A-Z</option>
            <option value="duration">Thoi gian xu ly</option>
          </select>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Khong co thu tuc phu hop</h3>
          <p className="mt-2 text-sm text-slate-600">
            Thu thu hep bo loc hoac doi tu khoa tim kiem de xem them ket qua.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          {filteredServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
