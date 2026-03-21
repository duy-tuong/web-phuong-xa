"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartCard({
  title,
  description,
  children,
  action,
}: ChartCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[hsl(120,10%,88%)] bg-white/95 p-5 shadow-[0_10px_26px_-14px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.22)] transition-all duration-200">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(135deg,rgba(15,81,50,0.06),rgba(196,122,40,0.03))] pointer-events-none" />
      <div className="relative flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[hsl(165,16%,12%)] leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[13px] text-[hsl(150,8%,44%)] mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="relative w-full">{children}</div>
    </div>
  );
}
