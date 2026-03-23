"use client";

import { CheckCircle2, Clock3, FileText } from "lucide-react";

const statistics = [
  {
    title: "Tổng hồ sơ đã nộp",
    value: "12",
    icon: FileText,
    iconClassName: "bg-blue-50 text-blue-600 p-3 rounded-full",
  },
  {
    title: "Hồ sơ đang xử lý",
    value: "3",
    icon: Clock3,
    iconClassName: "bg-orange-50 text-orange-600 p-3 rounded-full",
  },
  {
    title: "Hồ sơ đã hoàn thành",
    value: "9",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600 p-3 rounded-full",
  },
];

export default function ProfileStats() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {statistics.map((item) => {
        const Icon = item.icon;

        return (
          <article key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={item.iconClassName}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">{item.title}</h3>
                <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
