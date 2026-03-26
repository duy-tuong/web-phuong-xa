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

import { searchPublicApplications } from "@/services/applicationService";
import type { Application } from "@/types";

const STATUS_MAP: Record<Application["status"], { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: "Da tiep nhan",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  processing: {
    label: "Dang xu ly",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: <Clock className="h-4 w-4" />,
  },
  done: {
    label: "Da hoan thanh",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "Can bo sung / tu choi",
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
          setErrorMessage(error instanceof Error ? error.message : "Khong the tra cuu ho so luc nay.");
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
      setErrorMessage("Nhap it nhat so dien thoai hoac email de tra cuu.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    const params = new URLSearchParams();
    if (trimmedPhone) {
      params.set("phone", trimmedPhone);
    }
    if (trimmedEmail) {
      params.set("email", trimmedEmail);
    }

    router.push(`${pathname}?${params.toString()}`);
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
          Trang chu
        </Link>
        <span>&gt;</span>
        <Link href="/dich-vu" className="hover:text-emerald-700">
          Dich vu cong
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-slate-800">Tra cuu ho so</span>
      </nav>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-8 text-white shadow-xl md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex-1">
            <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Cong dich vu cong
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Tra cuu ho so</h1>
            <p className="mt-3 text-emerald-100/90 md:text-lg">
              Dung so dien thoai va email da khai khi nop ho so de xem tat ca ket qua xu ly tu he thong.
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
                placeholder="So dien thoai da dung khi nop ho so"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email da dang ky"
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
                Dang tra cuu...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Tra cuu ho so
              </>
            )}
          </button>
          <p className="text-center text-xs text-emerald-200">
            Ban co the nhap mot trong hai truong, nhung dung ca hai truong se cho ket qua chinh xac hon.
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
              <p className="text-sm text-slate-500">Tong ho so</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{groupedStats.total}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <p className="text-sm text-blue-700">Dang xu ly</p>
              <p className="mt-2 text-3xl font-black text-blue-800">{groupedStats.processing}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm text-emerald-700">Da hoan thanh</p>
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
                      <h2 className="text-xl font-bold text-slate-900">{item.serviceName || "Ho so dich vu cong"}</h2>
                      <p className="text-sm text-slate-600">Nguoi nop: {item.applicantName}</p>
                      <p className="text-sm text-slate-500">Ngay tiep nhan: {formatDate(item.createdAt)}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">Thong tin lien he</p>
                      <p className="mt-2">So dien thoai: {item.phone || "Dang cap nhat"}</p>
                      <p>Email: {item.email || "Dang cap nhat"}</p>
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
            <p className="text-lg font-bold text-slate-800">Chua tim thay ho so phu hop</p>
            <p className="mt-1 text-sm text-slate-500">
              He thong chua co ho so trung voi thong tin ban vua nhap. Kiem tra lai email, so dien thoai, hoac nop ho so moi.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dich-vu/nop-ho-so"
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Nop ho so moi
            </Link>
            <a
              href="tel:02773851234"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Goi ho tro
            </a>
          </div>
        </div>
      ) : null}

      {!hasSearched && !isSearching ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Thong tin can dung",
              desc: "Dung so dien thoai va email da khai khi nop de he thong tim dung ho so cua ban.",
            },
            {
              title: "Ket qua cap nhat",
              desc: "Trang thai ho so duoc cap nhat tu du lieu backend va dong bo tren trang ca nhan.",
            },
            {
              title: "Can nop moi?",
              desc: "Ban co the quay ve danh sach thu tuc va nop ho so truc tuyen ngay tren website.",
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
          href="/dich-vu/nop-ho-so"
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Nop ho so moi
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
