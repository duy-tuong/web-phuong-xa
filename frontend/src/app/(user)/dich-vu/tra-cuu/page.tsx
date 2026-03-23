"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  FileSearch,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Phone,
  Calendar,
  User,
  Hash,
  ArrowRight,
} from "lucide-react";

type StatusType = "processing" | "approved" | "pending" | "rejected";

interface TrackingResult {
  maHoSo: string;
  tenThuTuc: string;
  nguoiNop: string;
  ngayNop: string;
  ngayHenTra: string;
  coQuan: string;
  trangThai: StatusType;
  ghiChu: string;
  steps: {
    label: string;
    date: string;
    done: boolean;
    active?: boolean;
  }[];
}

const STATUS_MAP: Record<StatusType, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  processing: {
    label: "Đang xử lý",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <Clock className="h-4 w-4 text-blue-600" />,
  },
  approved: {
    label: "Đã hoàn thành",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  },
  pending: {
    label: "Chờ bổ sung",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
  },
  rejected: {
    label: "Bị trả lại",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="h-4 w-4 text-red-600" />,
  },
};

// Fake DB để demo (mã hồ sơ → { cccd: "...", data: {...} })
const MOCK_RECORDS: Record<string, { cccd: string; data: TrackingResult }> = {
  "HS-2025-001234": {
    cccd: "079001234567",
    data: {
      maHoSo: "HS-2025-001234",
      tenThuTuc: "Đăng ký kết hôn",
      nguoiNop: "Nguyễn Văn An",
      ngayNop: "10/03/2025",
      ngayHenTra: "17/03/2025",
      coQuan: "UBND Phường Cao Lãnh",
      trangThai: "processing",
      ghiChu: "Hồ sơ đang được thẩm tra tại bộ phận hộ tịch.",
      steps: [
        { label: "Tiếp nhận hồ sơ", date: "10/03/2025", done: true },
        { label: "Kiểm tra hồ sơ", date: "11/03/2025", done: true },
        { label: "Thẩm định & Trình ký", date: "14/03/2025", done: true, active: true },
        { label: "Trả kết quả", date: "17/03/2025", done: false },
      ],
    },
  },
  "HS-2025-000987": {
    cccd: "079002345678",
    data: {
      maHoSo: "HS-2025-000987",
      tenThuTuc: "Xác nhận thường trú",
      nguoiNop: "Trần Thị Bình",
      ngayNop: "01/03/2025",
      ngayHenTra: "08/03/2025",
      coQuan: "UBND Phường Cao Lãnh",
      trangThai: "approved",
      ghiChu: "Đã hoàn thành. Vui lòng đến nhận kết quả tại Bộ phận Một cửa.",
      steps: [
        { label: "Tiếp nhận hồ sơ", date: "01/03/2025", done: true },
        { label: "Kiểm tra hồ sơ", date: "02/03/2025", done: true },
        { label: "Thẩm định & Trình ký", date: "05/03/2025", done: true },
        { label: "Trả kết quả", date: "07/03/2025", done: true },
      ],
    },
  },
  "HS-2025-001100": {
    cccd: "079003456789",
    data: {
      maHoSo: "HS-2025-001100",
      tenThuTuc: "Khai sinh cho con",
      nguoiNop: "Lê Quốc Cường",
      ngayNop: "05/03/2025",
      ngayHenTra: "12/03/2025",
      coQuan: "UBND Phường Cao Lãnh",
      trangThai: "pending",
      ghiChu: "Yêu cầu bổ sung: Bản sao Giấy chứng sinh có chứng thực. Vui lòng nộp bổ sung trước ngày 20/03/2025.",
      steps: [
        { label: "Tiếp nhận hồ sơ", date: "05/03/2025", done: true },
        { label: "Kiểm tra hồ sơ", date: "06/03/2025", done: true, active: true },
        { label: "Thẩm định & Trình ký", date: "", done: false },
        { label: "Trả kết quả", date: "", done: false },
      ],
    },
  },
};

export default function TraCuuPage() {
  const [maHoSo, setMaHoSo] = useState("");
  const [cccd, setCccd] = useState("");
  const [result, setResult] = useState<TrackingResult | null | "not-found" | "wrong-cccd">(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maHoSo.trim() || !cccd.trim()) return;

    setIsSearching(true);
    setResult(null);

    // Mô phỏng API call
    setTimeout(() => {
      const record = MOCK_RECORDS[maHoSo.trim().toUpperCase()];
      if (!record) {
        setResult("not-found");
      } else if (record.cccd !== cccd.trim()) {
        setResult("wrong-cccd");
      } else {
        setResult(record.data);
      }
      setIsSearching(false);
    }, 900);
  };

  // Type-narrowed result cho JSX
  const safeResult: TrackingResult | null =
    result && result !== "not-found" && result !== "wrong-cccd" ? result : null;

  const statusInfo = safeResult ? STATUS_MAP[safeResult.trangThai] : null;

  return (
    <div className="mx-auto max-w-[900px] space-y-8 px-4 pb-16 md:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
        <span>›</span>
        <Link href="/dich-vu" className="hover:text-emerald-700">Dịch vụ công</Link>
        <span>›</span>
        <span className="font-medium text-slate-800">Tra cứu hồ sơ</span>
      </nav>

      {/* Header Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-8 text-white shadow-xl md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex-1">
            <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Cổng Dịch Vụ Công
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Tra Cứu Hồ Sơ</h1>
            <p className="mt-3 text-emerald-100/90 md:text-lg">
              Nhập mã hồ sơ để kiểm tra tiến độ xử lý thủ tục hành chính tại UBND Phường Cao Lãnh.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <FileSearch className="h-20 w-20 text-white/30" />
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-6 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={maHoSo}
                onChange={(e) => setMaHoSo(e.target.value)}
                placeholder="Mã hồ sơ (VD: HS-2025-001234)"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={cccd}
                onChange={(e) => setCccd(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="Số CCCD / CMND (12 số)"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                maxLength={12}
                inputMode="numeric"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching || !maHoSo.trim() || !cccd.trim()}
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
            💡 Demo: mã <strong>HS-2025-001234</strong> · CCCD <strong>079001234567</strong>
          </p>
        </form>
      </div>

      {/* Result Area */}
      {result === "not-found" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
          <FileSearch className="h-14 w-14 text-slate-300" />
          <div>
            <p className="text-lg font-bold text-slate-800">Không tìm thấy hồ sơ</p>
            <p className="mt-1 text-sm text-slate-500">
              Mã hồ sơ <span className="font-mono font-semibold text-slate-700">{maHoSo}</span> không tồn tại hoặc chưa được ghi nhận.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Liên hệ hotline: <a href="tel:02773851234" className="font-semibold text-emerald-700">0277 3851 234</a> để được hỗ trợ.
          </p>
        </div>
      )}

      {result === "wrong-cccd" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-12 text-center shadow-sm">
          <XCircle className="h-14 w-14 text-red-300" />
          <div>
            <p className="text-lg font-bold text-red-800">Thông tin không khớp</p>
            <p className="mt-1 text-sm text-red-600">
              Số CCCD không trùng khớp với mã hồ sơ. Vui lòng kiểm tra lại.
            </p>
          </div>
          <p className="text-sm text-red-500">
            Cần hỗ trợ? Gọi hotline: <a href="tel:02773851234" className="font-semibold underline">0277 3851 234</a>
          </p>
        </div>
      )}

      {safeResult !== null && statusInfo && (
        <div className="space-y-6">
          {/* Status Badge Card */}
          <div className={`flex flex-col gap-4 rounded-2xl border p-6 ${statusInfo.bg} sm:flex-row sm:items-center sm:justify-between`}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                {statusInfo.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Trạng thái hồ sơ</p>
                <p className={`text-xl font-black ${statusInfo.color}`}>{statusInfo.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Mã hồ sơ</p>
              <p className="font-mono text-lg font-bold text-slate-800">{safeResult.maHoSo}</p>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin hồ sơ</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Người nộp</p>
                    <p className="font-semibold text-slate-800">{safeResult.nguoiNop}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Thủ tục</p>
                    <p className="font-semibold text-slate-800">{safeResult.tenThuTuc}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Cơ quan giải quyết</p>
                    <p className="font-semibold text-slate-800">{safeResult.coQuan}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Thời gian</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Ngày nộp hồ sơ</p>
                    <p className="font-semibold text-slate-800">{safeResult.ngayNop}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Ngày hẹn trả kết quả</p>
                    <p className="font-semibold text-emerald-700">{safeResult.ngayHenTra}</p>
                  </div>
                </li>
              </ul>

              {/* Ghi chú */}
              {safeResult.ghiChu && (
                <div className={`mt-4 rounded-xl border p-3 text-sm ${safeResult.trangThai === "pending" ? "border-amber-200 bg-amber-50 text-amber-800" : safeResult.trangThai === "rejected" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                  <p className="font-semibold">Ghi chú:</p>
                  <p className="mt-0.5">{safeResult.ghiChu}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => setShowSteps((v) => !v)}
              className="flex w-full items-center justify-between"
            >
              <h3 className="text-base font-bold text-slate-800">Tiến trình xử lý</h3>
              {showSteps ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>

            {showSteps && (
              <ol className="relative mt-6 ml-3 border-l border-slate-200">
                {safeResult.steps.map((step: { label: string; date: string; done: boolean; active?: boolean }, i: number) => (
                  <li key={i} className="mb-6 ml-6 last:mb-0">
                    <span
                      className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                        step.active
                          ? "bg-blue-600"
                          : step.done
                          ? "bg-emerald-600"
                          : "bg-slate-200"
                      }`}
                    >
                      {step.done && !step.active ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      ) : step.active ? (
                        <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                      ) : null}
                    </span>
                    <p className={`font-semibold ${step.active ? "text-blue-700" : step.done ? "text-slate-800" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="mt-0.5 text-xs text-slate-400">{step.date}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Tải biên nhận
            </button>
            <a
              href="tel:02773851234"
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Phone className="h-4 w-4" />
              Liên hệ hỗ trợ
            </a>
            <Link
              href="/dich-vu/nop-ho-so"
              className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Nộp hồ sơ mới
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Hướng dẫn khi chưa tra cứu */}
      {!result && !isSearching && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Hash className="h-6 w-6 text-emerald-600" />, title: "Mã hồ sơ ở đâu?", desc: "Mã được in trên Phiếu tiếp nhận khi bạn nộp hồ sơ tại Bộ phận Một cửa." },
            { icon: <Clock className="h-6 w-6 text-blue-600" />, title: "Thời gian cập nhật", desc: "Thông tin trạng thái được cập nhật mỗi ngày làm việc theo tiến độ thực tế." },
            { icon: <Phone className="h-6 w-6 text-amber-600" />, title: "Cần hỗ trợ?", desc: "Liên hệ hotline 0277 3851 234 hoặc đến trực tiếp UBND Phường trong giờ hành chính." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                {item.icon}
              </div>
              <p className="mb-1 font-bold text-slate-800">{item.title}</p>
              <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
