"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  deleteCommentAdmin,
  fetchCommentsAdmin,
  updateCommentStatus,
} from "@/services/admin/comments";
import { getErrorMessage } from "@/services/admin/errors";
import { Comment } from "@/types";

const statusConfig: Record<Comment["status"], { label: string; className: string }> = {
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setComments(await fetchCommentsAdmin());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        keyword === "" ||
        comment.userName.toLowerCase().includes(keyword) ||
        comment.content.toLowerCase().includes(keyword) ||
        (comment.articleTitle || "").toLowerCase().includes(keyword);

      const matchesStatus = statusFilter === "all" || comment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, statusFilter]);

  const handleStatusChange = async (id: string, status: Comment["status"]) => {
    try {
      setError("");
      await updateCommentStatus(id, status);
      await loadComments();
    } catch (statusError) {
      setError(getErrorMessage(statusError));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setError("");
      await deleteCommentAdmin(deleteTarget.id);
      await loadComments();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Comment>[] = [
    {
      key: "userName",
      label: "Người dùng",
      render: (comment) => <span className="font-medium text-stone-800">{comment.userName}</span>,
    },
    {
      key: "articleTitle",
      label: "Bài viết",
      render: (comment) => <span className="block max-w-[220px] truncate text-stone-600">{comment.articleTitle || `#${comment.articleId}`}</span>,
    },
    {
      key: "content",
      label: "Nội dung",
      render: (comment) => <p className="line-clamp-2 max-w-xs text-stone-700">{comment.content}</p>,
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
      render: (comment) => <span className="text-sm text-stone-500">{format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}</span>,
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (comment) => (
        <div className="flex items-center gap-1">
          {comment.status !== "approved" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusChange(comment.id, "approved")}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-8 h-8"
              title="Duyệt bình luận"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          {comment.status !== "rejected" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusChange(comment.id, "rejected")}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 w-8 h-8"
              title="Từ chối bình luận"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(comment)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 w-8 h-8"
            title="Xóa bình luận"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquare}
        title="Quản lý bình luận"
        description={loading ? "Đang tải bình luận..." : `${comments.length} bình luận đang có trong hệ thống`}
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
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có bình luận nào"}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget ? `bình luận của ${deleteTarget.userName}` : undefined}
      />
    </div>
  );
}
