"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ScrollText, Search } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/services/admin/errors";
import { fetchLogsAdmin } from "@/services/admin/logs";
import { LogEntry } from "@/types";

const moduleBadgeClass: Record<string, string> = {
  Auth: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  Articles: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Services: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Media: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  Comments: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  Users: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  Applications: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchLogsAdmin({ page: 1, pageSize: 200 });
      setLogs(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const moduleOptions = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.module || log.entity))).filter(Boolean);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const moduleName = log.module || log.entity;
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        keyword === "" ||
        (log.user || log.userId).toLowerCase().includes(keyword) ||
        log.action.toLowerCase().includes(keyword) ||
        moduleName.toLowerCase().includes(keyword) ||
        (log.detail || "").toLowerCase().includes(keyword);

      const matchesModule = moduleFilter === "all" || moduleName === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [logs, moduleFilter, searchQuery]);

  const columns: Column<LogEntry>[] = [
    {
      key: "createdAt",
      label: "Thời gian",
      render: (log) => <span className="text-sm text-stone-600">{format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}</span>,
    },
    {
      key: "user",
      label: "Người thực hiện",
      render: (log) => <span className="font-medium text-stone-800">{log.user || log.userId}</span>,
    },
    {
      key: "module",
      label: "Phân hệ",
      render: (log) => {
        const moduleName = log.module || log.entity;
        return (
          <Badge variant="secondary" className={moduleBadgeClass[moduleName] || "bg-stone-100 text-stone-700 hover:bg-stone-100"}>
            {moduleName}
          </Badge>
        );
      },
    },
    {
      key: "action",
      label: "Hành động",
      render: (log) => <span className="text-stone-700">{log.action}</span>,
    },
    {
      key: "detail",
      label: "Chi tiết",
      className: "max-w-[340px]",
      render: (log) => <span className="block max-w-[340px] truncate text-stone-600">{log.detail || "--"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ScrollText}
        title="Nhật ký hệ thống"
        description={loading ? "Đang tải audit log..." : `${logs.length} bản ghi log đã đồng bộ`}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Tìm theo người dùng, hành động, chi tiết..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="border-stone-200 bg-white pl-9"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full border-stone-200 bg-white sm:w-[220px]">
            <SelectValue placeholder="Lọc theo phân hệ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phân hệ</SelectItem>
            {moduleOptions.map((moduleName) => (
              <SelectItem key={moduleName} value={moduleName}>
                {moduleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có bản ghi nhật ký phù hợp"}
      />
    </div>
  );
}
