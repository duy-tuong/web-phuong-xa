"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { normalizeKeyword } from "@/lib/normalize";
import { buildCompactPagination } from "@/lib/pagination";
import {
  buildDownloadableTemplates,
  type DownloadableTemplate,
} from "@/lib/service-templates";
import { fetchPublicMedia } from "@/services/mediaLibraryService";
import { getProcedures } from "@/services/serviceService";

const PAGE_SIZE = 8;
const ALL_FIELDS_LABEL = "Tất cả";

export default function KhoBieuMauHanhChinhPage() {
// 1. TẠO BỘ NHỚ LƯU TRỮ (STATE)
  // Quản lý danh sách gốc, trạng thái xoay vòng (loading), chữ khách gõ, lĩnh vực khách chọn và số trang.
  const [templates, setTemplates] = useState<DownloadableTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedField, setSelectedField] = useState(ALL_FIELDS_LABEL);
  const [currentPage, setCurrentPage] = useState(1);
// 2. TẢI VÀ GHÉP DỮ LIỆU KHI VỪA MỞ TRANG
  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
      // Gọi song song 2 API: Lấy file PDF/Word và Lấy thông tin thủ tục
        const [documentsResult, proceduresResult] = await Promise.allSettled([
          fetchPublicMedia("document", 500),
          getProcedures(),
        ]);

        if (!isMounted) {
          return;
        }

        const documents = documentsResult.status === "fulfilled" ? documentsResult.value : [];
        const procedures = proceduresResult.status === "fulfilled" ? proceduresResult.value : [];
// Ghép file và thủ tục lại với nhau để tạo thành cái link tải hoàn chỉnh, cất vào State.
        setTemplates(buildDownloadableTemplates(procedures, documents));
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
// 3. TẠO MENU CHỌN LĨNH VỰC
  // Tự động quét trong mảng dữ liệu, nhặt ra các "Lĩnh vực" không trùng lặp (Set) để làm menu thả xuống (VD: Đất đai, Hộ tịch...).
  const allFields = useMemo(() => {
    const fields = Array.from(new Set(templates.map((template) => template.field))).sort((a, b) => a.localeCompare(b, "vi"));
    return [ALL_FIELDS_LABEL, ...fields];
  }, [templates]);
// 4. BỘ LỌC KÉP: TÌM KIẾM CHỮ + LỌC LĨNH VỰC
  // Quét qua danh sách gốc: Bài nào vừa đúng "Lĩnh vực" khách chọn, vừa chứa "Từ khóa" khách gõ thì mới giữ lại.
  const filteredTemplates = useMemo(() => {
    const normalizedKeyword = normalizeKeyword(keyword);

    return templates.filter((template) => {
      const matchesField = selectedField === ALL_FIELDS_LABEL || template.field === selectedField;
      const matchesKeyword = !normalizedKeyword || normalizeKeyword(template.title).includes(normalizedKeyword);
      return matchesField && matchesKeyword; // Phải thỏa mãn cả 2 điều kiện
    });
  }, [keyword, selectedField, templates]);
// 5. CHIA TRANG CHO BẢNG HIỂN THỊ (PAGINATION)
  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  // Cắt cái mảng đã lọc ra lấy đúng 8 bài (PAGE_SIZE) của trang hiện tại để đem đi vẽ cái Bảng.
  const pageItems = filteredTemplates.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const paginationPages = buildCompactPagination(safeCurrentPage, totalPages);

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
            Tải về miễn phí các biểu mẫu, tài liệu hướng dẫn và hồ sơ mẫu cho hơn 100 thủ tục hành chính phổ biến tại Phường Cao Lãnh.
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
                    {field === ALL_FIELDS_LABEL ? "Lọc theo lĩnh vực: Tất cả" : field}
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
                      <td className="px-5 py-4 font-medium text-slate-900">{template.title}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {template.field}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <a
                          href={template.href}
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

