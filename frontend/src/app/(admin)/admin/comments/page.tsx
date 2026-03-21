"use client";

import { useState, useMemo } from "react";
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
import { mockArticles, mockComments } from "@/lib/mock-data";
import { Comment } from "@/types";
import { MessageSquare, Search, CheckCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const articleTitleById = useMemo(() => {
    return Object.fromEntries(
      mockArticles.map((article) => [article.id, article.title])
    ) as Record<string, string>;
  }, []);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch =
        searchQuery === "" ||
        comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (articleTitleById[comment.articleId] || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || comment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, statusFilter, articleTitleById]);

  const handleApprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c))
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
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
          {comment.articleTitle || articleTitleById[comment.articleId] || `#${comment.articleId}`}
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
      label: "Ngày",
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
          {comment.status !== "approved" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(comment.id)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-8 h-8"
              title="Duyệt bình luận"
            >
              <CheckCircle className="w-4 h-4" />
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
    <div>
      <PageHeader
        icon={MessageSquare}
        title="Quản lý bình luận"
        description="Kiểm duyệt bình luận từ người dùng"
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Tìm kiếm theo người dùng hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredComments}
        emptyMessage="Không có bình luận nào"
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget ? `bình luận của ${deleteTarget.userName}` : undefined}
      />
    </div>
  );
}
