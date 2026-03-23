<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // This one-time gate prevents SSR/CSR mismatch from interactive Radix controls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const storedValue = localStorage.getItem("admin_sidebar_collapsed");
    setIsSidebarCollapsed(storedValue === "1");
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-[hsl(48,33%,97%)]" />;
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(48,33%,97%)]">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-[84px]" : "lg:pl-[250px]"
        )}
      >
        <AdminHeader />
        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
=======
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return <div className="min-h-screen bg-slate-100">{children}</div>;
>>>>>>> frontend-user-minh-hieu
}
