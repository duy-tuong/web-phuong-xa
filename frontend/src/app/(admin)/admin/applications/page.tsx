"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ClipboardList, Search } from "lucide-react";

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
import {
  fetchApplicationsAdmin,
  getErrorMessage,
  updateApplicationStatus,
} from "@/services/adminService";
import { Application } from "@/types";

const statusConfig: Record<Application["status"], { label: string; className: string }> = {
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchApplicationsAdmin({ page: 1, pageSize: 200 });
      setApplications(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        !keyword ||
        app.applicantName.toLowerCase().includes(keyword) ||
        (app.serviceName || "").toLowerCase().includes(keyword) ||
        app.phone.toLowerCase().includes(keyword) ||
        app.email.toLowerCase().includes(keyword);

      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: Application["status"]) => {
    try {
      setError("");
      await updateApplicationStatus(id, newStatus);
      await loadApplications();
    } catch (statusError) {
      setError(getErrorMessage(statusError));
    }
  };

  const columns: Column<Application>[] = [
    {
      key: "applicantName",
      label: "Công dân",
      render: (item) => <span className="font-medium text-stone-800">{item.applicantName}</span>,
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
      render: (item) => <span className="block max-w-[220px] truncate text-stone-700">{item.email}</span>,
    },
    {
      key: "serviceName",
      label: "Dịch vụ",
      render: (item) => <span className="text-stone-700">{item.serviceName || item.serviceId}</span>,
    },
    {
      key: "createdAt",
      label: "Ngày nộp",
      render: (item) => <span className="text-sm text-stone-600">{format(new Date(item.createdAt), "dd/MM/yyyy")}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item) => {
        const config = statusConfig[item.status];
        return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Cập nhật trạng thái",
      render: (item) => (
        <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value as Application["status"])}>
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

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Quản lý hồ sơ"
        description={loading ? "Đang tải hồ sơ..." : `${applications.length} hồ sơ đang có trong hệ thống`}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Tìm theo tên, dịch vụ, SĐT hoặc email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Không tìm thấy hồ sơ nào"}
      />
    </div>
  );
}
