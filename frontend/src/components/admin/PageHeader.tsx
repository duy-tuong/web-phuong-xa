"use client";

import { ReactNode } from "react";
import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  action,
  children,
}: PageHeaderProps) {
  const ActionIcon = action?.icon || Plus;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-[hsl(156,38%,92%)] text-[hsl(156,38%,28%)] flex items-center justify-center shadow-inner">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-[26px] font-bold text-[hsl(165,16%,12%)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-[hsl(150,8%,44%)] mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        {children}
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-[hsl(156,38%,28%)] hover:bg-[hsl(156,38%,24%)] text-white gap-2 w-full sm:w-auto rounded-[12px] px-4 h-11 font-semibold"
          >
            <ActionIcon className="w-4 h-4" />
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
