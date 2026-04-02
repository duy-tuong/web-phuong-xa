"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ClipboardList, Search, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { ConfirmDeleteModal } from "@/components/admin/Modal";
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
import {
  fetchApplicationsAdmin,
  deleteApplication,
  updateApplicationStatus,
} from "@/services/admin/applications";
import { resolveApiAssetUrl } from "@/lib/api-base-url";
import { getErrorMessage } from "@/services/admin/errors";
import { Application } from "@/types";

const statusConfig: Record<
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

const parseAttachmentUrls = (value?: string) => {
  if (!value) return [] as string[];
  const trimmed = value.trim();
  if (!trimmed) return [] as string[];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      // Fall back to comma split.
    }
  }
  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchApplicationsAdmin({ page: 1, pageSize: 200 });
      setApplications(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
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

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / pageSize),
  );

  const pagedApplications = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleStatusChange = async (
    id: string,
    newStatus: Application["status"],
  ) => {
    try {
      setError("");
      await updateApplicationStatus(id, newStatus);
      await loadApplications();
    } catch (statusError) {
      setError(getErrorMessage(statusError));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteApplication(deleteTarget.id);
      await loadApplications();
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Application>[] = [
    {
      key: "applicantName",
      label: "Công dân",
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
        <span className="block max-w-[220px] truncate text-stone-700">
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
      key: "attachedFiles",
      label: "Tệp đính kèm",
      render: (item) => {
        const urls = parseAttachmentUrls(item.attachedFiles);
        if (urls.length === 0) {
          return <span className="text-stone-400">--</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            {urls.map((url, index) => (
              <a
                key={`${url}-${index}`}
                href={resolveApiAssetUrl(url)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:underline"
              >
                Tệp {index + 1}
              </a>
            ))}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Ngày nộp",
      render: (item) => (
        <span className="text-sm text-stone-600">
          {format(new Date(item.createdAt), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item) => {
        const config = statusConfig[item.status];
        return (
          <Badge variant="secondary" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (item) => (
        <div className="flex flex-col gap-2 min-w-[200px]">
          <Select
            value={item.status}
            onValueChange={(value) =>
              handleStatusChange(item.id, value as Application["status"])
            }
          >
            <SelectTrigger className="w-full h-9 text-sm border-stone-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="done">Hoàn thành</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-9 w-full text-red-600 hover:text-red-700"
            onClick={() => setDeleteTarget(item)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa hồ sơ
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Quản lý hồ sơ"
        description={
          isLoading
            ? "Đang tải hồ sơ..."
            : `${applications.length} hồ sơ đang có trong hệ thống`
        }
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
        data={pagedApplications}
        emptyMessage={
          isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy hồ sơ nào"
        }
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.applicantName}
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
