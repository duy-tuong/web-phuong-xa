"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ScrollText, Search } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockLogs } from "@/lib/mock-data";
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

const moduleLabelMap: Record<string, string> = {
  Auth: "Xác thực",
  Articles: "Bài viết",
  Services: "Dịch vụ",
  Media: "Phương tiện",
  Comments: "Bình luận",
  Users: "Người dùng",
  Applications: "Hồ sơ",
};

const actionLabelMap: Record<string, string> = {
  Login: "Đăng nhập",
  "Create Article": "Tạo bài viết",
  "Update Service": "Cập nhật dịch vụ",
  "Upload Media": "Tải lên phương tiện",
  "Delete Comment": "Xóa bình luận",
  "Approve Comment": "Duyệt bình luận",
  "Update Article": "Cập nhật bài viết",
  "Create User": "Tạo người dùng",
  "Update Application": "Cập nhật hồ sơ",
};

const detailLabelMap: Record<string, string> = {
  "Spam comment removed": "Đã xóa bình luận spam",
  "Created user phamthid": "Đã tạo người dùng phamthid",
};

function getModuleLabel(moduleName: string) {
  return moduleLabelMap[moduleName] || moduleName;
}

function getActionLabel(action: string) {
  return actionLabelMap[action] || action;
}

function getDetailLabel(detail?: string) {
  if (!detail) return "Không có";
  return detailLabelMap[detail] || detail;
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const moduleOptions = useMemo(() => {
    return Array.from(new Set(mockLogs.map((log) => log.module || log.entity))).filter(Boolean);
  }, []);

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const moduleName = log.module || log.entity;
      const detail = log.detail || "";
      const actor = log.user || log.userId;
      const moduleLabel = getModuleLabel(moduleName);
      const actionLabel = getActionLabel(log.action);
      const detailLabel = getDetailLabel(detail);
      const searchTerm = searchQuery.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        actor.toLowerCase().includes(searchTerm) ||
        moduleLabel.toLowerCase().includes(searchTerm) ||
        actionLabel.toLowerCase().includes(searchTerm) ||
        detailLabel.toLowerCase().includes(searchTerm);

      const matchesModule = moduleFilter === "all" || moduleName === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [moduleFilter, searchQuery]);

  const columns: Column<LogEntry>[] = [
    {
      key: "createdAt",
      label: "Thời gian",
      render: (log) => (
        <span className="text-sm text-stone-600">
          {format(new Date(log.timestamp || log.createdAt), "dd/MM/yyyy HH:mm")}
        </span>
      ),
    },
    {
      key: "user",
      label: "Người thực hiện",
      render: (log) => (
        <span className="font-medium text-stone-800">{log.user || log.userId}</span>
      ),
    },
    {
      key: "module",
      label: "Phân hệ",
      render: (log) => {
        const moduleName = log.module || log.entity;
        const moduleLabel = getModuleLabel(moduleName);
        return (
          <Badge
            variant="secondary"
            className={moduleBadgeClass[moduleName] || "bg-stone-100 text-stone-700 hover:bg-stone-100"}
          >
            {moduleLabel}
          </Badge>
        );
      },
    },
    {
      key: "action",
      label: "Hành động",
      render: (log) => <span className="text-stone-700">{getActionLabel(log.action)}</span>,
    },
    {
      key: "detail",
      label: "Chi tiết",
      className: "max-w-[340px]",
      render: (log) => (
        <span className="text-stone-600 block truncate max-w-[340px]">
          {getDetailLabel(log.detail)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={ScrollText}
        title="Nhật ký hệ thống"
        description="Theo dõi các thao tác đã diễn ra trong khu vực quản trị"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Tìm theo người dùng, hành động hoặc chi tiết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                {getModuleLabel(moduleName)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        emptyMessage="Không có bản ghi nhật ký phù hợp"
      />
    </div>
  );
}
