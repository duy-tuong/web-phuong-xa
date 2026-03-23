"use client";

import { Eye, FileEdit } from "lucide-react";

type Status = "Chờ bổ sung" | "Đang xử lý" | "Hoàn thành";

const recentRecords: Array<{
  id: string;
  service: string;
  date: string;
  status: Status;
}> = [
  {
    id: "HS-2023-8921",
    service: "Đăng ký khai sinh",
    date: "20/10/2023",
    status: "Đang xử lý",
  },
  {
    id: "HS-2023-7543",
    service: "Cấp bản sao trích lục hộ tịch",
    date: "15/10/2023",
    status: "Chờ bổ sung",
  },
  {
    id: "HS-2023-6102",
    service: "Xác nhận tình trạng hôn nhân",
    date: "01/10/2023",
    status: "Hoàn thành",
  },
  {
    id: "HS-2023-4421",
    service: "Đăng ký thường trú",
    date: "12/08/2023",
    status: "Hoàn thành",
  },
];

function getStatusClassName(status: Status) {
  switch (status) {
    case "Chờ bổ sung":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "Đang xử lý":
      return "border border-orange-200 bg-orange-50 text-orange-700";
    case "Hoàn thành":
      return "border border-green-200 bg-green-50 text-green-700";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function ProfileRecentRecords() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Lịch sử hồ sơ gần đây</h3>
          <p className="mt-1 text-sm text-slate-500">Theo dõi trạng thái từng hồ sơ và thao tác nhanh khi cần bổ sung.</p>
        </div>
        <button type="button" className="text-sm font-bold text-emerald-700 transition hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
              <th className="px-6 py-4 font-semibold">Mã hồ sơ</th>
              <th className="px-6 py-4 font-semibold">Tên thủ tục</th>
              <th className="px-6 py-4 font-semibold">Ngày nộp</th>
              <th className="px-6 py-4 font-semibold">Trạng thái</th>
              <th className="px-6 py-4 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {recentRecords.map((record) => (
              <tr key={record.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-6 py-4 font-medium text-slate-900">{record.id}</td>
                <td className="max-w-[260px] px-6 py-4">{record.service}</td>
                <td className="px-6 py-4">{record.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    {record.status === "Chờ bổ sung" ? (
                      <FileEdit className="h-5 w-5 cursor-pointer text-blue-600 transition hover:text-blue-800" />
                    ) : (
                      <Eye className="h-5 w-5 cursor-pointer text-gray-500 transition hover:text-gray-700" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
