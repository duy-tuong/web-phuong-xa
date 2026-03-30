"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

import { fetchPublicMedia } from "@/services/mediaLibraryService";
import { getProcedures } from "@/services/serviceService";
import type { MediaFile } from "@/types";
import type { ProcedureDetail } from "@/types/service";

type DownloadableTemplate = {
  id: string;
  title: string;
  href: string;
};

const DEFAULT_TEMPLATE_LIMIT = 3;
const EXPANDED_TEMPLATE_STEP = 8;

function formatTemplateTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Biểu mẫu";
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ServiceSidebar() {
  const searchParams = useSearchParams();
  const [procedures, setProcedures] = useState<ProcedureDetail[]>([]);
  const [documentFiles, setDocumentFiles] = useState<MediaFile[]>([]);
  const [templateKeyword, setTemplateKeyword] = useState("");
  const [visibleTemplateCount, setVisibleTemplateCount] = useState(DEFAULT_TEMPLATE_LIMIT);

  const showAllTemplates = searchParams.get("templates") === "all";

  useEffect(() => {
    setVisibleTemplateCount(showAllTemplates ? EXPANDED_TEMPLATE_STEP : DEFAULT_TEMPLATE_LIMIT);
  }, [showAllTemplates, templateKeyword]);

  useEffect(() => {
    let isMounted = true;

    const loadSidebarData = async () => {
      const [proceduresResult, documentsResult] = await Promise.allSettled([
        getProcedures(),
        fetchPublicMedia("document", 100),
      ]);

      if (!isMounted) {
        return;
      }

      setProcedures(proceduresResult.status === "fulfilled" ? proceduresResult.value : []);
      setDocumentFiles(documentsResult.status === "fulfilled" ? documentsResult.value : []);
    };

    void loadSidebarData();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProcedures = procedures.slice(0, 3);
  const templatesFromMedia = useMemo<DownloadableTemplate[]>(
    () =>
      documentFiles
        .map((file) => ({
          id: `media-${file.id}`,
          title: formatTemplateTitle(file.fileName),
          href: file.url || file.filePath,
        }))
        .filter((item) => Boolean(item.href)),
    [documentFiles],
  );

  const templatesFromProcedures = useMemo<DownloadableTemplate[]>(
    () =>
      procedures
        .filter((procedure) => procedure.wordTemplateHref && procedure.wordTemplateHref !== "#")
        .map((procedure) => ({
          id: `procedure-${procedure.slug}`,
          title: procedure.title,
          href: procedure.wordTemplateHref,
        })),
    [procedures],
  );

  const allDownloadableTemplates = useMemo(
    () => {
      const merged = [...templatesFromMedia, ...templatesFromProcedures];
      const seen = new Set<string>();

      return merged.filter((item) => {
        if (!item.href || seen.has(item.href)) {
          return false;
        }

        seen.add(item.href);
        return true;
      });
    },
    [templatesFromMedia, templatesFromProcedures],
  );

  const filteredTemplates = useMemo(() => {
    const normalizedKeyword = normalizeSearch(templateKeyword);
    if (!normalizedKeyword) {
      return allDownloadableTemplates;
    }

    return allDownloadableTemplates.filter((template) =>
      normalizeSearch(template.title).includes(normalizedKeyword),
    );
  }, [allDownloadableTemplates, templateKeyword]);

  const downloadableTemplates = useMemo(
    () => (showAllTemplates ? filteredTemplates.slice(0, visibleTemplateCount) : filteredTemplates.slice(0, DEFAULT_TEMPLATE_LIMIT)),
    [filteredTemplates, showAllTemplates, visibleTemplateCount],
  );

  const hasMoreTemplates = showAllTemplates && visibleTemplateCount < filteredTemplates.length;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-emerald-700/10 bg-emerald-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-emerald-700">search</span>
          <h3 className="font-bold tracking-tight text-slate-900">Tra cứu hồ sơ</h3>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Kiểm tra tình trạng xử lý hồ sơ bằng số điện thoại và email đã dùng khi nộp.
          </p>
          <Link
            href="/dich-vu/tra-cuu"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-900"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            Đến trang tra cứu
          </Link>
        </div>
      </div>

      <div id="bieu-mau-tai-nhieu" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-blue-700/10 bg-blue-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-blue-700">description</span>
          <h3 className="font-bold tracking-tight text-slate-900">Biểu mẫu tải nhiều</h3>
        </div>
        <div className="space-y-2 p-3">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
            <input
              type="text"
              value={templateKeyword}
              onChange={(event) => setTemplateKeyword(event.target.value)}
              placeholder="Tìm biểu mẫu..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1f7a5a] focus:outline-none"
            />
          </div>

          {downloadableTemplates.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {templateKeyword.trim() ? "Không tìm thấy biểu mẫu phù hợp." : "Chưa có biểu mẫu đính kèm nào từ hệ thống."}
            </div>
          ) : (
            downloadableTemplates.map((template) => (
              <a
                key={template.id}
                href={template.href}
                download
                className="group flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <Download className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 transition-colors group-hover:text-[#1f7a5a]">
                    {template.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Tải biểu mẫu hồ sơ</div>
                </div>
              </a>
            ))
          )}

          {showAllTemplates && filteredTemplates.length > 0 ? (
            <p className="px-1 text-xs text-slate-500">
              Hiển thị {Math.min(downloadableTemplates.length, filteredTemplates.length)}/{filteredTemplates.length} biểu mẫu
            </p>
          ) : null}

          {hasMoreTemplates ? (
            <button
              type="button"
              onClick={() => setVisibleTemplateCount((current) => current + EXPANDED_TEMPLATE_STEP)}
              className="mt-1 w-full rounded-xl bg-blue-50 py-2.5 text-center text-xs font-black uppercase tracking-wider text-blue-700 transition-colors hover:bg-blue-100"
            >
              Xem thêm biểu mẫu
            </button>
          ) : null}

          {allDownloadableTemplates.length > DEFAULT_TEMPLATE_LIMIT ? (
            showAllTemplates ? (
              <Link
                href="/dich-vu#bieu-mau-tai-nhieu"
                className="mt-2 block w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-black uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1f7a5a]"
              >
                Thu gọn danh sách
              </Link>
            ) : (
              <Link
                href="/dich-vu/kho-bieu-mau-hanh-chinh"
                className="mt-2 block w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-black uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1f7a5a]"
              >
                Xem tất cả biểu mẫu
              </Link>
            )
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-amber-700/10 bg-amber-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-amber-700">article</span>
          <h3 className="font-bold tracking-tight text-slate-900">Thủ tục được quan tâm</h3>
        </div>
        <div className="space-y-1 p-3">
          {featuredProcedures.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Đang tải danh sách thủ tục...
            </div>
          ) : (
            featuredProcedures.map((procedure) => (
              <Link
                key={procedure.slug}
                href={`/dich-vu/chi-tiet-ho-so/${procedure.slug}`}
                className="group flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
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
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f7a5a] to-[#14523b] p-6 text-white shadow-md">
        <div className="absolute -right-6 -top-6 text-white/10">
          <span className="material-symbols-outlined select-none text-9xl">support_agent</span>
        </div>
        <div className="relative z-10">
          <h3 className="mb-2 text-lg font-bold tracking-wide">Cần hỗ trợ?</h3>
          <p className="mb-5 text-sm leading-relaxed text-emerald-50/90">
            Liên hệ tổng đài hoặc quay về mục dịch vụ để chọn đúng thủ tục trước khi nộp hồ sơ.
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
              Xem thông tin liên hệ
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
