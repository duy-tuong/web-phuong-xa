"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileSearch,
  Mail,
  Phone,
  Search,
} from "lucide-react";

import {
  buildPathWithSearchParams,
  cloneSearchParams,
  setOptionalQueryParam,
} from "@/lib/query-params";
import { searchPublicApplications } from "@/services/applicationService";
import type { Application } from "@/types";

const STATUS_MAP: Record<Application["status"], { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: "Đã tiếp nhận",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  processing: {
    label: "Đang xử lý",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: <Clock className="h-4 w-4" />,
  },
  done: {
    label: "Đã hoàn thành",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "Cần bổ sung / từ chối",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export default function TraCuuPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [results, setResults] = useState<Application[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPhone(searchParams.get("phone") ?? "");
    setEmail(searchParams.get("email") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const initialPhone = searchParams.get("phone") ?? "";
    const initialEmail = searchParams.get("email") ?? "";

    if (!initialPhone && !initialEmail) {
      return;
    }

    let isMounted = true;

    const runSearch = async () => {
      setIsSearching(true);
      setErrorMessage("");
      try {
        const data = await searchPublicApplications({
          phone: initialPhone || undefined,
          email: initialEmail || undefined,
        });

        if (!isMounted) {
          return;
        }

        setResults(data);
        setHasSearched(true);
      } catch (error) {
        if (isMounted) {
          setResults([]);
          setHasSearched(true);
          setErrorMessage(error instanceof Error ? error.message : "Không thể tra cứu hồ sơ lúc này.");
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    void runSearch();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedPhone && !trimmedEmail) {
      setErrorMessage("Nhập ít nhất số điện thoại hoặc email để tra cứu.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    const params = cloneSearchParams("");
    setOptionalQueryParam(params, "phone", trimmedPhone);
    setOptionalQueryParam(params, "email", trimmedEmail);
    router.push(buildPathWithSearchParams(pathname, params));
  };

  const groupedStats = useMemo(() => {
    return {
      total: results.length,
      processing: results.filter((item) => item.status === "processing").length,
      done: results.filter((item) => item.status === "done").length,
    };
  }, [results]);

  return (
    <div className="mx-auto max-w-[980px] space-y-8 px-4 pb-16 md:px-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">
          Trang chủ
        </Link>
        <span>&gt;</span>
        <Link href="/dich-vu" className="hover:text-emerald-700">
          Dịch vụ công
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-slate-800">Tra cứu hồ sơ</span>
      </nav>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-8 text-white shadow-xl md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex-1">
            <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Cổng dịch vụ công
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Tra cứu hồ sơ</h1>
            <p className="mt-3 text-emerald-100/90 md:text-lg">
              Dùng số điện thoại và email đã khai khi nộp hồ sơ để xem tất cả kết quả xử lý từ hệ thống.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <FileSearch className="h-20 w-20 text-white/30" />
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Số điện thoại đã dùng khi nộp hồ sơ"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email đã đăng ký"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50 disabled:opacity-60"
          >
            {isSearching ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                Đang tra cứu...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Tra cứu hồ sơ
              </>
            )}
          </button>
          <p className="text-center text-xs text-emerald-200">
            Bạn có thể nhập một trong hai trường, nhưng dùng cả hai trường sẽ cho kết quả chính xác hơn.
          </p>
        </form>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {hasSearched && results.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Tổng hồ sơ</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{groupedStats.total}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <p className="text-sm text-blue-700">Đang xử lý</p>
              <p className="mt-2 text-3xl font-black text-blue-800">{groupedStats.processing}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm text-emerald-700">Đã hoàn thành</p>
              <p className="mt-2 text-3xl font-black text-emerald-800">{groupedStats.done}</p>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((item) => {
              const statusInfo = STATUS_MAP[item.status];

              return (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          HS-{item.id.padStart(6, "0")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{item.serviceName || "Hồ sơ dịch vụ công"}</h2>
                      <p className="text-sm text-slate-600">Người nộp: {item.applicantName}</p>
                      <p className="text-sm text-slate-500">Ngày tiếp nhận: {formatDate(item.createdAt)}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">Thông tin liên hệ</p>
                      <p className="mt-2">Số điện thoại: {item.phone || "Đang cập nhật"}</p>
                      <p>Email: {item.email || "Đang cập nhật"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {hasSearched && !isSearching && results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
          <FileSearch className="h-14 w-14 text-slate-300" />
          <div>
            <p className="text-lg font-bold text-slate-800">Chưa tìm thấy hồ sơ phù hợp</p>
            <p className="mt-1 text-sm text-slate-500">
              Hệ thống chưa có hồ sơ trùng với thông tin bạn vừa nhập. Kiểm tra lại email, số điện thoại, hoặc nộp hồ sơ mới.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dich-vu"
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Nộp hồ sơ mới
            </Link>
            <a
              href="tel:02773851234"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Gọi hỗ trợ
            </a>
          </div>
        </div>
      ) : null}

      {!hasSearched && !isSearching ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Thông tin cần dùng",
              desc: "Dùng số điện thoại và email đã khai khi nộp để hệ thống tìm đúng hồ sơ của bạn.",
            },
            {
              title: "Kết quả cập nhật",
              desc: "Trạng thái hồ sơ được cập nhật từ dữ liệu backend và đồng bộ trên trang cá nhân.",
            },
            {
              title: "Cần nộp mới?",
              desc: "Bạn có thể quay về danh sách thủ tục và nộp hồ sơ trực tuyến ngay trên website.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-2 font-bold text-slate-800">{item.title}</p>
              <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Link
          href="/dich-vu"
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Nộp hồ sơ mới
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
