"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockApplications } from "@/lib/mock-data";
import { Application } from "@/types";
import { ClipboardList, Search } from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG: Record<
  Application["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  done: {
    label: "Hoàn thành",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ---------- Filtered data ----------

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.serviceName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  // ---------- Handlers ----------

  const handleStatusChange = (id: string, newStatus: Application["status"]) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  // ---------- Table columns ----------

  const columns: Column<Application>[] = [
    {
      key: "applicantName",
      label: "Họ tên công dân",
      render: (item) => (
        <span className="font-medium text-stone-800">{item.applicantName}</span>
      ),
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (item) => <span className="text-stone-700">{item.phone}</span>,
    },
    {
      key: "email",
      label: "Email",
      className: "max-w-[220px]",
      render: (item) => (
        <span className="text-stone-700 truncate block max-w-[220px]">{item.email}</span>
      ),
    },
    {
      key: "serviceName",
      label: "Dịch vụ",
      render: (item) => (
        <span className="text-stone-700">{item.serviceName || item.serviceId}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày nộp",
      render: (item) => (
        <span className="text-stone-600 text-sm">
          {format(new Date(item.createdAt), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item) => {
        const config = STATUS_CONFIG[item.status];
        return (
          <Badge variant="secondary" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "note",
      label: "Ghi chú",
      className: "max-w-xs",
      render: (item) => (
        <span className="text-stone-500 truncate block max-w-xs text-sm">
          {item.note || <span className="text-stone-300">&mdash;</span>}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Cập nhật trạng thái",
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(value) =>
            handleStatusChange(item.id, value as Application["status"])
          }
        >
          <SelectTrigger className="w-full min-w-[160px] h-9 text-sm border-stone-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="done">Hoàn thành</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Quản lý hồ sơ"
        description="Theo dõi và xử lý hồ sơ của công dân"
      />

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Tìm theo tên, dịch vụ, SĐT hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] border-stone-200">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="done">Hoàn thành</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredApplications}
        emptyMessage="Không tìm thấy hồ sơ nào"
      />
    </div>
  );
}
