"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { LogEntry } from "@/types";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

const moduleBadgeClass: Record<string, string> = {
  Auth: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  Articles: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Services: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Media: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  Comments: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  Users: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  Applications: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
};

const VIETNAM_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatVietnamTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  const parts = VIETNAM_TIME_FORMATTER.formatToParts(date);
  const lookup: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });

  const day = lookup.day ?? "";
  const month = lookup.month ?? "";
  const year = lookup.year ?? "";
  const hour = lookup.hour ?? "";
  const minute = lookup.minute ?? "";

  return `${day}/${month}/${year} ${hour}:${minute}`.trim();
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  type LogApi = {
    id?: number | string;
    Id?: number | string;
    user?: string;
    User?: string;
    action?: string;
    Action?: string;
    entity?: string;
    Entity?: string;
    detail?: string;
    Detail?: string;
    createdAt?: string;
    CreatedAt?: string;
  };

  const fetchLogs = useCallback(async () => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };

    if (searchQuery.trim()) {
      params.keyword = searchQuery.trim();
    }

    if (moduleFilter !== "all") {
      params.entityName = moduleFilter;
    }

    const res = await api.get("/auditlogs", { params });
    const payload = res.data ?? {};
    const data = Array.isArray(payload.data) ? (payload.data as LogApi[]) : [];
    const mapped = data.map((log) => ({
      id: String(log.id ?? log.Id ?? ""),
      userId: "",
      action: log.action ?? log.Action ?? "",
      entity: log.entity ?? log.Entity ?? "",
      createdAt: log.createdAt ?? log.CreatedAt ?? new Date().toISOString(),
      user: log.user ?? log.User ?? "",
      detail: log.detail ?? log.Detail ?? undefined,
      module: log.entity ?? log.Entity ?? "",
      timestamp: log.createdAt ?? log.CreatedAt ?? new Date().toISOString(),
    })) as LogEntry[];

    setLogs(mapped);
    setTotalPages(Number(payload.totalPages ?? 1) || 1);
  }, [moduleFilter, page, pageSize, searchQuery]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchLogs();
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải nhật ký.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [fetchLogs]);

  const moduleOptions = useMemo(() => {
    return Array.from(
      new Set(logs.map((log) => log.module || log.entity)),
    ).filter(Boolean);
  }, [logs]);

  const filteredLogs = useMemo(() => logs, [logs]);

  const columns: Column<LogEntry>[] = [
    {
      key: "createdAt",
      label: "Thời gian",
      render: (log) => (
        <span className="text-sm text-stone-600">
          {formatVietnamTime(log.createdAt)}
        </span>
      ),
    },
    {
      key: "user",
      label: "Người thực hiện",
      render: (log) => (
        <span className="font-medium text-stone-800">
          {log.user || log.userId}
        </span>
      ),
    },
    {
      key: "module",
      label: "Phân hệ",
      render: (log) => {
        const moduleName = log.module || log.entity;
        return (
          <Badge
            variant="secondary"
            className={
              moduleBadgeClass[moduleName] ||
              "bg-stone-100 text-stone-700 hover:bg-stone-100"
            }
          >
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
      render: (log) => (
        <span className="block max-w-[340px] truncate text-stone-600">
          {log.detail || "--"}
        </span>
      ),
    },
  ];

  return (
    <div>
      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <PageHeader
        icon={ScrollText}
        title="Nhật ký hệ thống"
        description={
          isLoading
            ? "Đang tải audit log..."
            : `${logs.length} bản ghi log đã đồng bộ`
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Tìm theo người dùng, hành động, chi tiết..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border-stone-200 bg-white pl-9"
          />
        </div>
        <Select
          value={moduleFilter}
          onValueChange={(value) => {
            setModuleFilter(value);
            setPage(1);
          }}
        >
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
        emptyMessage={
          isLoading ? "Đang tải nhật ký..." : "Không có bản ghi nhật ký phù hợp"
        }
      />

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || isLoading}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
