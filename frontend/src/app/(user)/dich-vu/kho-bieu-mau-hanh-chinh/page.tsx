"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";

import { fetchPublicMedia } from "@/services/mediaLibraryService";
import { getProcedures } from "@/services/serviceService";
import type { MediaFile } from "@/types";

type FormTemplate = {
  id: string;
  name: string;
  field: string;
  downloadUrl: string;
};

const PAGE_SIZE = 8;

function normalizeKeyword(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferField(title: string) {
  const normalized = normalizeKeyword(title);

  if (normalized.includes("khai sinh") || normalized.includes("khai tu") || normalized.includes("ket hon")) {
    return "Hộ tịch";
  }

  if (normalized.includes("tam tru") || normalized.includes("tam vang") || normalized.includes("cu tru")) {
    return "Cư trú";
  }

  if (normalized.includes("kinh doanh") || normalized.includes("doanh nghiep")) {
    return "Kinh doanh";
  }

  if (normalized.includes("dat") || normalized.includes("nha") || normalized.includes("bat dong san")) {
    return "Đất đai";
  }

  if (normalized.includes("xay dung") || normalized.includes("cong trinh")) {
    return "Xây dựng";
  }

  if (normalized.includes("ngheo") || normalized.includes("an sinh") || normalized.includes("bao tro")) {
    return "An sinh";
  }

  return "Hành chính công";
}

function toTemplateTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Biểu mẫu";
}

function getUrlKey(value: string) {
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const url = new URL(value);
      return `${url.pathname}${url.search}`;
    }
  } catch {
    // Keep original value if URL parsing fails.
  }

  return value;
}

function buildPagination(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export default function KhoBieuMauHanhChinhPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedField, setSelectedField] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        const [documentsResult, proceduresResult] = await Promise.allSettled([
          fetchPublicMedia("document", 500),
          getProcedures(),
        ]);

        if (!isMounted) {
          return;
        }

        const documents = documentsResult.status === "fulfilled" ? documentsResult.value : [];
        const procedures = proceduresResult.status === "fulfilled" ? proceduresResult.value : [];

        const templatesFromProcedures = procedures
          .filter((procedure) => procedure.wordTemplateHref && procedure.wordTemplateHref !== "#")
          .map((procedure) => ({
            id: `procedure-${procedure.slug}`,
            name: procedure.title,
            field: inferField(procedure.title),
            downloadUrl: procedure.wordTemplateHref,
          }));

        const procedureFieldByUrl = new Map<string, string>(
          templatesFromProcedures.map((item) => [getUrlKey(item.downloadUrl), item.field]),
        );

        const templatesFromDocuments = documents.map((file: MediaFile) => {
          const downloadUrl = file.url || file.filePath;
          const title = toTemplateTitle(file.fileName);
          const matchedField = procedureFieldByUrl.get(getUrlKey(downloadUrl));

          return {
            id: `media-${file.id}`,
            name: title,
            field: matchedField || inferField(title),
            downloadUrl,
          };
        });

        const merged = [...templatesFromDocuments, ...templatesFromProcedures];
        const seen = new Set<string>();

        const uniqueTemplates = merged.filter((template) => {
          const key = getUrlKey(template.downloadUrl);
          if (!key || key === "#" || seen.has(key)) {
            return false;
          }

          seen.add(key);
          return true;
        });

        setTemplates(uniqueTemplates);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const allFields = useMemo(() => {
    const fields = Array.from(new Set(templates.map((template) => template.field))).sort((a, b) => a.localeCompare(b, "vi"));
    return ["Tất cả", ...fields];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const normalizedKeyword = normalizeKeyword(keyword);

    return templates.filter((template) => {
      const matchesField = selectedField === "Tất cả" || template.field === selectedField;
      const matchesKeyword = !normalizedKeyword || normalizeKeyword(template.name).includes(normalizedKeyword);
      return matchesField && matchesKeyword;
    });
  }, [keyword, selectedField, templates]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageItems = filteredTemplates.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const paginationPages = buildPagination(safeCurrentPage, totalPages);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const onKeywordChange = (value: string) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const onFieldChange = (value: string) => {
    setSelectedField(value);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <section className="mx-auto w-full max-w-[1240px] space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-[#1f7a5a]">
              Trang chủ
            </Link>
            <span>&gt;</span>
            <Link href="/dich-vu" className="transition-colors hover:text-[#1f7a5a]">
              Dịch vụ hành chính
            </Link>
            <span>&gt;</span>
            <span className="font-medium text-slate-900">Kho biểu mẫu hành chính</span>
          </nav>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Kho biểu mẫu hành chính</h1>
          <p className="max-w-3xl text-slate-600">
            Tra cứu và tải về biểu mẫu theo lĩnh vực được đồng bộ trực tiếp từ API.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
            <label className="relative block">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="Tìm kiếm tên biểu mẫu..."
                className="h-14 w-full rounded-xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#1f7a5a] focus:outline-none"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Lọc theo lĩnh vực</span>
              <select
                value={selectedField}
                onChange={(event) => onFieldChange(event.target.value)}
                className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 px-4 pr-12 text-base text-slate-900 focus:border-[#1f7a5a] focus:outline-none"
              >
                {allFields.map((field) => (
                  <option key={field} value={field}>
                    {field === "Tất cả" ? "Lọc theo lĩnh vực: Tất cả" : field}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                expand_more
              </span>
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                  <th className="w-20 px-5 py-4">STT</th>
                  <th className="px-5 py-4">Tên biểu mẫu</th>
                  <th className="w-56 px-5 py-4">Lĩnh vực</th>
                  <th className="w-44 px-5 py-4 text-center">Tải về</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                      Đang tải dữ liệu biểu mẫu...
                    </td>
                  </tr>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                      Không tìm thấy biểu mẫu phù hợp.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((template, index) => (
                    <tr key={template.id} className="border-t border-slate-200 text-sm text-slate-700">
                      <td className="px-5 py-4 font-semibold text-slate-500">
                        {(safeCurrentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">{template.name}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {template.field}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <a
                          href={template.downloadUrl}
                          download
                          className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#196448]"
                        >
                          <Download className="h-4 w-4" />
                          Tải về
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              {paginationPages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={
                    page === safeCurrentPage
                      ? "h-10 min-w-10 rounded-lg bg-[#1f7a5a] px-3 text-sm font-bold text-white"
                      : "h-10 min-w-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
                  }
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trang sau
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
