"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import type { Application } from "@/types";

function formatDate(dateValue: string) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getStatusClassName(status: Application["status"]) {
  if (status === "done") return "border border-green-200 bg-green-50 text-green-700";
  if (status === "processing") return "border border-orange-200 bg-orange-50 text-orange-700";
  if (status === "rejected") return "border border-red-200 bg-red-50 text-red-700";
  return "border border-blue-200 bg-blue-50 text-blue-700";
}

function getStatusLabel(status: Application["status"]) {
  if (status === "done") return "Hoan thanh";
  if (status === "processing") return "Dang xu ly";
  if (status === "rejected") return "Bi tu choi";
  return "Cho tiep nhan";
}

type ProfileRecentRecordsProps = {
  applications: Application[];
};

export default function ProfileRecentRecords({ applications }: ProfileRecentRecordsProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Lich su ho so gan day</h3>
          <p className="mt-1 text-sm text-slate-500">Theo doi trang thai nhung ho so dich vu cong ban da gui.</p>
        </div>
        <Link href="/dich-vu/tra-cuu" className="text-sm font-bold text-emerald-700 transition hover:underline">
          Xem tat ca
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">Ban chua co ho so nao duoc nop tren he thong.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
                <th className="px-6 py-4 font-semibold">Ma ho so</th>
                <th className="px-6 py-4 font-semibold">Ten thu tuc</th>
                <th className="px-6 py-4 font-semibold">Ngay nop</th>
                <th className="px-6 py-4 font-semibold">Trang thai</th>
                <th className="px-6 py-4 text-right font-semibold">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {applications.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium text-slate-900">HS-{record.id.padStart(6, "0")}</td>
                  <td className="max-w-[260px] px-6 py-4">{record.serviceName || `Dich vu #${record.serviceId}`}</td>
                  <td className="px-6 py-4">{formatDate(record.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <Link href={`/dich-vu/tra-cuu?email=${encodeURIComponent(record.email)}&phone=${encodeURIComponent(record.phone)}`} className="text-gray-500 transition hover:text-gray-700">
                        <Eye className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
