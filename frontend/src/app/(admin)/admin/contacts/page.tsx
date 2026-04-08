"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Mail, Search, Trash2 } from "lucide-react";

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
import { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { fetchContactsAdmin, deleteContact, updateContactStatus } from "@/services/admin/contacts";
import { getErrorMessage } from "@/services/admin/errors";
import type { Contact } from "@/types";

const statusConfig: Record<
  Contact["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  processed: {
    label: "Đã tiếp nhận",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  resolved: {
    label: "Đã giải quyết",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
};

export default function ContactsPage() {
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setAdminRole(localStorage.getItem("admin_role"));
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchContactsAdmin({ page: 1, pageSize: 200 });
      setContacts(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        !keyword ||
        contact.fullName.toLowerCase().includes(keyword) ||
        contact.phone.toLowerCase().includes(keyword) ||
        (contact.email || "").toLowerCase().includes(keyword) ||
        contact.category.toLowerCase().includes(keyword) ||
        contact.content.toLowerCase().includes(keyword);

      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));

  const pagedContacts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleStatusChange = async (id: string, newStatus: Contact["status"]) => {
    try {
      setError("");
      await updateContactStatus(id, newStatus);
      await loadContacts();
    } catch (statusError) {
      setError(getErrorMessage(statusError));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteContact(deleteTarget.id);
      await loadContacts();
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Contact>[] = [
    {
      key: "fullName",
      label: "Công dân",
      render: (item) => (
        <span className="font-medium text-stone-800">{item.fullName}</span>
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
          {item.email || "--"}
        </span>
      ),
    },
    {
      key: "category",
      label: "Chuyên mục",
      render: (item) => (
        <Badge variant="secondary" className="font-normal">
          {item.category}
        </Badge>
      ),
    },
    {
      key: "content",
      label: "Nội dung",
      className: "max-w-[260px]",
      render: (item) => (
        <span className="block max-w-[260px] truncate text-stone-600">
          {item.content}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày gửi",
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
      label: adminRole === "Editor" ? "Cập nhật trạng thái" : "Thao tác",
      render: (item) => (
        <div className="flex flex-col gap-2 min-w-[200px]">
          <Select
            value={item.status}
            onValueChange={(value) =>
              handleStatusChange(item.id, value as Contact["status"])
            }
          >
            <SelectTrigger className="w-full h-9 text-sm border-stone-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="processed">Đã tiếp nhận</SelectItem>
              <SelectItem value="resolved">Đã giải quyết</SelectItem>
            </SelectContent>
          </Select>
          {adminRole === "Editor" ? null : (
            <Button
              variant="outline"
              className="h-9 w-full text-red-600 hover:text-red-700"
              onClick={() => setDeleteTarget(item)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa liên hệ
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Quản lý liên hệ"
        description={
          isLoading
            ? "Đang tải liên hệ..."
            : `${contacts.length} liên hệ đã gửi về hệ thống`
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
            placeholder="Tìm theo tên, chuyên mục, nội dung, SĐT hoặc email..."
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
            <SelectItem value="processed">Đã tiếp nhận</SelectItem>
            <SelectItem value="resolved">Đã giải quyết</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={pagedContacts}
        emptyMessage={
          isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy liên hệ nào"
        }
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.fullName}
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
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || isLoading}
            className="h-9 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Trước
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || isLoading}
            className="h-9 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
