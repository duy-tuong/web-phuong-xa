"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Landmark, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { adminNavItems } from "@/components/admin/nav-items";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [logoUnavailable, setLogoUnavailable] = useState(false);
  const logoPath = "/logo-admin.png";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r lg:flex transition-[width] duration-300",
        isCollapsed ? "w-[84px]" : "w-[240px]",
        "bg-[hsl(156,38%,22%)] border-[hsl(156,24%,18%)]"
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b border-[hsl(156,24%,18%)]",
          isCollapsed ? "justify-center px-2" : "px-4"
        )}
      >
        <div className={cn("flex items-center min-w-0", isCollapsed ? "justify-center" : "gap-3")}>
          <div
            className={cn(
              "rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0",
              isCollapsed ? "w-10 h-10" : "w-11 h-11"
            )}
          >
            {logoUnavailable ? (
              <div
                className={cn(
                  "rounded-xl bg-[hsl(156,32%,18%)] flex items-center justify-center",
                  isCollapsed ? "w-10 h-10" : "w-11 h-11"
                )}
              >
                <Landmark
                  className={cn(
                    "text-[hsl(40,33%,88%)]",
                    isCollapsed ? "w-5 h-5" : "w-6 h-6"
                  )}
                />
              </div>
            ) : (
              <NextImage
                src={logoPath}
                alt="Logo Phường Cao Lãnh"
                width={isCollapsed ? 40 : 44}
                height={isCollapsed ? 40 : 44}
                className="h-full w-full object-contain"
                priority
                onError={() => setLogoUnavailable(true)}
              />
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-[16px] font-bold leading-tight tracking-[0.01em] bg-[linear-gradient(180deg,hsl(41,72%,93%),hsl(36,62%,80%))] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.18)] truncate">
                Phường Cao Lãnh
              </h1>
              <p className="text-[10px] text-[hsl(40,30%,72%)] truncate mt-0.5">
                Hệ thống quản trị nội dung
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className={cn("flex-1 py-4 space-y-1 overflow-y-auto", isCollapsed ? "px-2" : "px-3")}>
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center rounded-lg text-sm font-semibold transition-all duration-200 group",
                isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? isCollapsed
                    ? "bg-[hsl(154,24%,23%)] text-[hsl(40,68%,78%)] shadow-sm"
                    : "bg-[hsl(154,24%,23%)] text-[hsl(40,68%,78%)] shadow-sm border-l-4 border-[hsl(34,60%,50%)]"
                  : "text-[hsl(40,24%,78%)] hover:bg-[hsl(156,26%,20%)] hover:text-[hsl(40,30%,92%)]"
              )}
            >
              <Icon
                className={cn(
                  "w-[20px] h-[20px] flex-shrink-0 transition-colors",
                  isActive
                    ? "text-[hsl(34,72%,50%)]"
                    : "text-[hsl(40,28%,70%)] group-hover:text-[hsl(40,30%,88%)]"
                )}
              />
              <span className={cn("truncate", isCollapsed && "hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-[hsl(156,24%,18%)] py-2", isCollapsed ? "px-2" : "px-3")}>
        <Button
          type="button"
          variant="ghost"
          onClick={onToggleCollapse}
          className={cn(
            "h-10 w-full text-[hsl(40,24%,78%)] hover:bg-[hsl(156,26%,20%)] hover:text-[hsl(40,30%,92%)]",
            isCollapsed ? "justify-center px-0" : "justify-start gap-2.5 px-3"
          )}
          aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          <span className={cn(isCollapsed && "hidden")}>
            {isCollapsed ? "Mở rộng" : "Thu gọn"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
