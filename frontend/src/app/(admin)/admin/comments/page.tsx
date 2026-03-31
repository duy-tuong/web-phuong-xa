"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, MessageSquare, Search, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Comment } from "@/types";
import api from "@/services/api";

const statusConfig: Record<
  Comment["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export default function CommentsPage() {
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    setAdminRole(localStorage.getItem("admin_role"));
  }, []);

  const isEditor = adminRole === "Editor";

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const fetchComments = async () => {
    const res = await api.get("/comments");
    const data = Array.isArray(res.data) ? res.data : [];
    const mapped = data.map((comment) => ({
      id: String(comment.id ?? comment.Id ?? ""),
      articleId: String(comment.articleId ?? comment.ArticleId ?? ""),
      userName: comment.userName ?? comment.UserName ?? "",
      content: comment.content ?? comment.Content ?? "",
      status:
        (comment.status ?? comment.Status ?? "pending").toLowerCase() ===
        "approved"
          ? "approved"
          : (comment.status ?? comment.Status ?? "pending").toLowerCase() ===
              "rejected"
            ? "rejected"
            : "pending",
      createdAt:
        comment.createdAt ?? comment.CreatedAt ?? new Date().toISOString(),
      articleTitle: comment.articleTitle ?? comment.ArticleTitle ?? undefined,
    })) as Comment[];

    setComments(mapped);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchComments();
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải bình luận.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch =
        searchQuery === "" ||
        comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.articleTitle || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || comment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, statusFilter]);

  const handleApprove = async (id: string) => {
    setErrorMessage("");
    try {
      await api.put(`/comments/${id}`, { status: "Approved" });
      await fetchComments();
    } catch {
      setErrorMessage("Duyệt bình luận thất bại.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    try {
      await api.delete(`/comments/${deleteTarget.id}`);
      await fetchComments();
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa bình luận thất bại.");
    }
  };

  const columns: Column<Comment>[] = [
    {
      key: "userName",
      label: "Người dùng",
      render: (comment) => (
        <span className="font-medium text-stone-800">{comment.userName}</span>
      ),
    },
    {
      key: "articleTitle",
      label: "Bài viết",
      render: (comment) => (
        <span className="text-stone-600 truncate block max-w-[200px]">
          {comment.articleTitle || `#${comment.articleId}`}
        </span>
      ),
    },
    {
      key: "content",
      label: "Nội dung",
      render: (comment) => (
        <p className="line-clamp-2 max-w-xs text-stone-700">
          {comment.content}
        </p>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (comment) => {
        const config = statusConfig[comment.status];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (comment) => (
        <span className="text-sm text-stone-500">
          {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (comment) => (
        <div className="flex items-center gap-1">
          {comment.status !== "approved" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(comment.id)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-8 h-8"
              title="Duyệt bình luận"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : null}
          {isEditor ? null : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(comment)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 w-8 h-8"
              title="Xóa bình luận"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
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
        icon={MessageSquare}
        title="Quản lý bình luận"
        description={
          isLoading
            ? "Đang tải bình luận..."
            : `${comments.length} bình luận đang có trong hệ thống`
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Tìm theo người dùng, bài viết, nội dung..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9 bg-white border-stone-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-stone-200">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredComments}
        emptyMessage={
          isLoading ? "Đang tải bình luận..." : "Không có bình luận nào"
        }
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={
          deleteTarget ? `bình luận của ${deleteTarget.userName}` : undefined
        }
      />
    </div>
  );
}
