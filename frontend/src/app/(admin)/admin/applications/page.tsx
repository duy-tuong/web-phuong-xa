"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Application } from "@/types";
import { ClipboardList, Search } from "lucide-react";
import { format } from "date-fns";
import api from "@/services/api";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  type ApplicationApi = {
    id?: number | string;
    Id?: number | string;
    serviceId?: number | string;
    ServiceId?: number | string;
    serviceName?: string;
    ServiceName?: string;
    applicantName?: string;
    ApplicantName?: string;
    phone?: string;
    Phone?: string;
    email?: string;
    Email?: string;
    status?: string;
    Status?: string;
    createdAt?: string;
    CreatedAt?: string;
  };

  const mapStatusFromApi = (
    value: string | undefined,
  ): Application["status"] => {
    const normalized = (value ?? "pending").toLowerCase();
    if (normalized === "approved") return "done";
    if (normalized === "processing") return "processing";
    if (normalized === "rejected") return "rejected";
    return "pending";
  };

  const mapStatusToApi = (value: Application["status"]) => {
    if (value === "done") return "Approved";
    if (value === "processing") return "Processing";
    if (value === "rejected") return "Rejected";
    return "Pending";
  };

  const fetchApplications = useCallback(async () => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };
    if (statusFilter !== "all") {
      params.status = mapStatusToApi(statusFilter as Application["status"]);
    }

    const res = await api.get("/applications", { params });
    const payload = res.data ?? {};
    const data = Array.isArray(payload.data)
      ? (payload.data as ApplicationApi[])
      : [];
    const mapped = data.map((app) => ({
      id: String(app.id ?? app.Id ?? ""),
      serviceId: String(app.serviceId ?? app.ServiceId ?? ""),
      applicantName: app.applicantName ?? app.ApplicantName ?? "",
      phone: app.phone ?? app.Phone ?? "",
      email: app.email ?? app.Email ?? "",
      status: mapStatusFromApi(app.status ?? app.Status),
      createdAt: app.createdAt ?? app.CreatedAt ?? new Date().toISOString(),
      serviceName: app.serviceName ?? app.ServiceName ?? "",
    })) as Application[];

    setApplications(mapped);
    setTotalPages(Number(payload.totalPages ?? 1) || 1);
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchApplications();
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải hồ sơ.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [fetchApplications]);

  // ---------- Filtered data ----------

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.serviceName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  // ---------- Handlers ----------

  const handleStatusChange = async (
    id: string,
    newStatus: Application["status"],
  ) => {
    setErrorMessage("");
    try {
      await api.put(`/applications/${id}/status`, {
        status: mapStatusToApi(newStatus),
      });
      await fetchApplications();
    } catch {
      setErrorMessage("Cập nhật trạng thái thất bại.");
    }
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
        <span className="text-stone-700 truncate block max-w-[220px]">
          {item.email}
        </span>
      ),
    },
    {
      key: "serviceName",
      label: "Dịch vụ",
      render: (item) => (
        <span className="text-stone-700">
          {item.serviceName || item.serviceId}
        </span>
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
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
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
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
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
        emptyMessage={
          isLoading ? "Đang tải hồ sơ..." : "Không tìm thấy hồ sơ nào"
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            {[5, 10, 20, 50].map((size) => (
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
