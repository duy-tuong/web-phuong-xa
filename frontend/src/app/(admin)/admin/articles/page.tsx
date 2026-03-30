"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, FileText, Pencil, Search, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import Editor from "@/components/admin/Editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAdminArticle,
  deleteAdminArticle,
  fetchAdminArticles,
  updateAdminArticle,
} from "@/services/admin/articles";
import { fetchCategoriesAdmin } from "@/services/admin/categories";
import { getErrorMessage } from "@/services/admin/errors";
import { Article, Category } from "@/types";

interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  status: "draft" | "published";
  featuredImage: string;
}

const emptyForm: ArticleFormData = {
  title: "",
  slug: "",
  content: "",
  categoryId: "",
  status: "draft",
  featuredImage: "",
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [articleRows, categoryRows] = await Promise.all([
        fetchAdminArticles(),
        fetchCategoriesAdmin(),
      ]);
      setArticles(articleRows);
      setCategories(categoryRows);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        keyword === "" ||
        article.title.toLowerCase().includes(keyword) ||
        (article.slug || "").toLowerCase().includes(keyword) ||
        (article.author?.fullName || article.author?.username || "").toLowerCase().includes(keyword);

      const matchesCategory = categoryFilter === "all" || article.categoryId === categoryFilter;
      const matchesStatus = statusFilter === "all" || article.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, categoryFilter, search, statusFilter]);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      categoryId: article.categoryId,
      status: article.status,
      featuredImage: article.featuredImage || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArticle(null);
    setFormData(emptyForm);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingArticle) {
        await updateAdminArticle(editingArticle.id, formData);
      } else {
        await createAdminArticle(formData);
      }

      await loadData();
      closeModal();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setError("");
      await deleteAdminArticle(deleteTarget.id);
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Article>[] = [
    {
      key: "title",
      label: "Tiêu đề",
      className: "min-w-[300px] max-w-[360px]",
      render: (article) => <span className="line-clamp-1 font-semibold text-stone-900">{article.title}</span>,
    },
    {
      key: "category",
      label: "Danh mục",
      render: (article) => <Badge variant="secondary">{article.category?.name || article.categoryId}</Badge>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (article) =>
        article.status === "published" ? (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Đã đăng</Badge>
        ) : (
          <Badge className="bg-stone-100 text-stone-600 hover:bg-stone-100">Nháp</Badge>
        ),
    },
    {
      key: "author",
      label: "Tác giả",
      render: (article) => <span className="text-stone-600">{article.author?.fullName || article.author?.username || "--"}</span>,
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (article) => <span className="text-sm text-stone-500">{format(new Date(article.createdAt), "dd/MM/yyyy")}</span>,
    },
    {
      key: "actions",
      label: "Thao tác",
      className: "text-right w-[132px]",
      render: (article) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-sky-700" onClick={() => setPreviewArticle(article)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-emerald-700" onClick={() => openEditModal(article)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-red-600" onClick={() => setDeleteTarget(article)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Quản lý bài viết"
        description={loading ? "Đang tải bài viết..." : `${articles.length} bài viết đã đồng bộ với API admin`}
        action={{ label: "Thêm bài viết", onClick: openCreateModal }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px_180px] gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Tìm theo tiêu đề, slug, tác giả..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full border-stone-200">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full border-stone-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã đăng</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredArticles}
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Không tìm thấy bài viết nào"}
      />

      <Modal
        open={!!previewArticle}
        onClose={() => setPreviewArticle(null)}
        title={previewArticle?.title || "Xem nhanh bài viết"}
        description={previewArticle ? `Tác giả: ${previewArticle.author?.fullName || previewArticle.author?.username || "--"}` : undefined}
        size="xl"
        footer={<Button variant="outline" onClick={() => setPreviewArticle(null)}>Đóng</Button>}
      >
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-4">
          {previewArticle?.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewArticle.featuredImage} alt={previewArticle.title} className="mb-4 max-h-64 w-full rounded-md object-cover" />
          )}
          {previewArticle?.content ? (
            <div
              className="text-sm leading-6 text-stone-700 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_img]:my-3 [&_img]:rounded-md [&_ol]:mb-3 [&_p]:mb-3 [&_ul]:mb-3"
              dangerouslySetInnerHTML={{ __html: previewArticle.content }}
            />
          ) : (
            <p className="text-sm text-stone-500">Bài viết chưa có nội dung.</p>
          )}
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingArticle ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        description="Dữ liệu được lưu trực tiếp vào API /articles."
        size="xl"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white" onClick={handleSave} disabled={submitting}>
              {editingArticle ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <FormField
            type="text"
            label="Tiêu đề"
            name="title"
            required
            value={formData.title}
            onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
            placeholder="Nhập tiêu đề bài viết"
          />

          <FormField
            type="text"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
            placeholder="Để trống để backend tự sinh nếu cần"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              type="select"
              label="Danh mục"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              placeholder="Chon danh muc"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <FormField
              type="select"
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={(value) => setFormData((prev) => ({ ...prev, status: value as "draft" | "published" }))}
              options={[
                { label: "Nháp", value: "draft" },
                { label: "Đã đăng", value: "published" },
              ]}
            />
          </div>

          <FormField
            type="text"
            label="Ảnh đại diện"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={(value) => setFormData((prev) => ({ ...prev, featuredImage: value }))}
            placeholder="/uploads/ten-anh.jpg hoặc URL đầy đủ"
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">Nội dung <span className="text-red-500 ml-0.5">*</span></label>
            <div className="min-h-[240px]">
              <Editor value={formData.content} onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))} />
            </div>
            <p className="text-xs text-stone-500">Tóm tắt sẽ được backend tự tạo từ nội dung nếu để trống.</p>
          </div>

          {formData.content && (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Xem nhanh văn bản:</span> {stripHtml(formData.content).slice(0, 180) || "Nội dung đang rỗng"}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
