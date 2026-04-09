"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  buildPathWithSearchParams,
  cloneSearchParams,
  parsePositivePageParam,
  setPageQueryParam,
} from "@/lib/query-params";
import { buildCompactPagination } from "@/lib/pagination";
import { inferServiceField } from "@/lib/service-templates";
import { getProcedures } from "@/services/serviceService";
import type { ProcedureDetail } from "@/types/service";
import ServiceCard, { type ServiceCardData } from "./ServiceCard";

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
      level: "Mức độ 4",
      levelClass: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    level: "Mức độ 3",
    levelClass: "border-orange-200 bg-orange-50 text-orange-700",
  };
}

function buildServiceDescription(procedure: ProcedureDetail) {
  const topRequirements = procedure.requirements.slice(0, 2);
  if (topRequirements.length === 0) {
    return "Thông tin thành phần hồ sơ đang được cập nhật từ hệ thống dịch vụ công.";
  }

  return `Hồ sơ cần chuẩn bị: ${topRequirements.join("; ")}.`;
}

function mapProcedureToCard(
  procedure: ProcedureDetail,
  index: number,
): ServiceCardData {
  const { level, levelClass } = getLevelData(procedure);
  const normalizedField = procedure.field ? toFieldValue(procedure.field) : "";
  const resolvedField =
    !normalizedField || normalizedField === "hanh-chinh-cong"
      ? inferServiceField(procedure.title)
      : procedure.field || inferServiceField(procedure.title);

  return {
    slug: procedure.slug,
    profileCode: procedure.id
      ? `DV-${String(procedure.id).padStart(3, "0")}`
      : `DV-${String(index + 1).padStart(3, "0")}`,
    level,
    levelClass,
    field: resolvedField,
    title: procedure.title,
    description: buildServiceDescription(procedure),
    duration: procedure.processingTime,
    fee: procedure.fee,
  };
}

type SortMode = "default" | "name" | "duration";
const ITEMS_PER_PAGE = 4;

export default function ServiceList() {
  const router = useRouter();
  const pathname = usePathname();
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

  const services = useMemo(
    () => procedures.map(mapProcedureToCard),
    [procedures],
  );
  const keyword = (searchParams.get("q") ?? "").trim().toLowerCase();
  const currentPage = parsePositivePageParam(searchParams.get("page"));

  const filteredServices = useMemo(() => {
    const nextServices = services.filter((service) => {
      const matchesKeyword =
        !keyword ||
        service.title.toLowerCase().includes(keyword) ||
        service.description.toLowerCase().includes(keyword) ||
        service.field.toLowerCase().includes(keyword);

      return matchesKeyword;
    });

    if (sortMode === "name") {
      return [...nextServices].sort((left, right) =>
        left.title.localeCompare(right.title, "vi"),
      );
    }

    if (sortMode === "duration") {
      return [...nextServices].sort((left, right) =>
        left.duration.localeCompare(right.duration, "vi"),
      );
    }

    return nextServices;
  }, [keyword, services, sortMode]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedServices = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, safeCurrentPage]);

  useEffect(() => {
    if (currentPage === safeCurrentPage) {
      return;
    }

    const params = cloneSearchParams(searchParams);
    setPageQueryParam(params, safeCurrentPage);
    router.replace(buildPathWithSearchParams(pathname, params));
  }, [currentPage, pathname, router, safeCurrentPage, searchParams]);

  const visiblePages = useMemo(
    () => buildCompactPagination(safeCurrentPage, totalPages),
    [safeCurrentPage, totalPages],
  );

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    const params = cloneSearchParams(searchParams);
    setPageQueryParam(params, nextPage);
    router.push(buildPathWithSearchParams(pathname, params));
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Đang tải danh sách thủ tục...
          </p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex w-full flex-col space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Chưa có dịch vụ công nào
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Hệ thống chưa có dữ liệu thủ tục hành chính để hiển thị. Khi backend
            có dữ liệu, danh sách sẽ tự động cập nhật.
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
            Danh sách thủ tục
            <span className="flex h-7 items-center justify-center rounded-full bg-emerald-100 px-3 text-sm font-black text-[#1f7a5a]">
              {filteredServices.length}
            </span>
          </h2>
          {keyword && (
            <p className="mt-2 text-sm text-slate-500">
              Đang hiển thị kết quả phù hợp với bộ lọc bạn đã chọn.
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm sm:w-auto md:justify-end md:gap-3">
          <span className="font-semibold text-slate-500">Sắp xếp theo:</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="cursor-pointer appearance-none border-none bg-transparent font-bold text-[#1f7a5a] outline-none"
          >
            <option value="default">Mặc định</option>
            <option value="name">Tên A-Z</option>
            <option value="duration">Thời gian xử lý</option>
          </select>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Không có thủ tục phù hợp
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Thử thu hẹp bộ lọc hoặc đổi từ khóa tìm kiếm để xem thêm kết quả.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          {pagedServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}

          {totalPages > 1 ? (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                    page === safeCurrentPage
                      ? "bg-[#1f7a5a] text-white"
                      : "border border-slate-200 text-slate-700 hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
