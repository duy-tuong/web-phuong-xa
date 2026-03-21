"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; positive: boolean };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[hsl(120,10%,88%)] bg-white/95 p-5 shadow-[0_10px_26px_-14px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.22)] transition-all duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,81,50,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(196,122,40,0.06),transparent_36%)]" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[13px] font-semibold text-[hsl(150,8%,42%)] uppercase tracking-[0.08em]">
            {title}
          </p>
          <p className="text-[34px] font-bold text-[hsl(165,16%,12%)] leading-[1.1]">
            {value}
          </p>
          {description && (
            <p className="text-[13px] text-[hsl(150,8%,44%)]">{description}</p>
          )}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                trend.positive
                  ? "bg-[hsl(140,35%,92%)] text-[hsl(140,35%,28%)]"
                  : "bg-[hsl(0,72%,95%)] text-[hsl(0,72%,45%)]"
              }`}
            >
              {trend.positive ? "▲" : "▼"} {trend.positive ? "+" : ""}
              {trend.value}% so với tháng trước
            </span>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-[hsl(156,38%,92%)] text-[hsl(156,38%,28%)] flex items-center justify-center shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
