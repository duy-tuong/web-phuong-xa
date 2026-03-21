"use client";

import { useState, useMemo } from "react";
import { FileText, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import Editor from "@/components/admin/Editor";
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
import { mockArticles, mockCategories, mockUsers } from "@/lib/mock-data";
import { Article } from "@/types";

// ---------------------------------------------------------------------------
// Form data shape used for create / edit
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ArticlesPage() {
  // ----- data state -----
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  // ----- filter state -----
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ----- modal state -----
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(emptyForm);

  // ----- delete state -----
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  // ----- preview state -----
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // -----------------------------------------------------------------------
  // Filtered articles
  // -----------------------------------------------------------------------
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || article.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || article.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, search, categoryFilter, statusFilter]);

  // -----------------------------------------------------------------------
  // Modal helpers
  // -----------------------------------------------------------------------
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
      featuredImage: article.featuredImage ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArticle(null);
    setFormData(emptyForm);
  };

  // -----------------------------------------------------------------------
  // CRUD handlers
  // -----------------------------------------------------------------------
  const handleSave = () => {
    if (!formData.title.trim() || !formData.slug.trim() || !formData.categoryId) return;

    const selectedCategory = mockCategories.find(
      (c) => c.id === formData.categoryId
    );
    if (!selectedCategory) return;

    if (editingArticle) {
      // Update existing
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                title: formData.title,
              slug: formData.slug.trim(),
                content: formData.content,
                categoryId: selectedCategory.id,
                category: selectedCategory,
                authorId: a.authorId || "1",
                status: formData.status,
                featuredImage: formData.featuredImage || undefined,
                updatedAt: new Date().toISOString(),
                publishedAt:
                  formData.status === "published"
                    ? a.publishedAt || new Date().toISOString()
                    : null,
              }
            : a
        )
      );
    } else {
      // Create new
      const defaultAuthor = mockUsers[0];
      const newArticle: Article = {
        id: crypto.randomUUID(),
        title: formData.title,
        slug: formData.slug.trim(),
        content: formData.content,
        categoryId: selectedCategory.id,
        authorId: defaultAuthor.id,
        category: selectedCategory,
        author: defaultAuthor,
        status: formData.status,
        featuredImage: formData.featuredImage || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt:
          formData.status === "published" ? new Date().toISOString() : null,
      };
      setArticles((prev) => [newArticle, ...prev]);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // -----------------------------------------------------------------------
  // Table columns
  // -----------------------------------------------------------------------
  const columns: Column<Article>[] = [
    {
      key: "title",
      label: "Tiêu đề",
      className: "min-w-[300px] max-w-[360px]",
      render: (article) => (
        <span className="font-semibold text-stone-900 line-clamp-1">
          {article.title}
        </span>
      ),
    },
    {
      key: "category",
      label: "Danh mục",
      render: (article) => (
        <Badge variant="secondary" className="font-normal">
          {article.category?.name ||
            mockCategories.find((category) => category.id === article.categoryId)
              ?.name ||
            article.categoryId}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (article) =>
        article.status === "published" ? (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            Đã đăng
          </Badge>
        ) : (
          <Badge className="bg-stone-100 text-stone-600 hover:bg-stone-100">
            Nháp
          </Badge>
        ),
    },
    {
      key: "author",
      label: "Tác giả",
      render: (article) => (
        <span className="text-stone-600">
          {article.author?.username ||
            mockUsers.find((user) => user.id === article.authorId)?.username ||
            article.authorId}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (article) => (
        <span className="text-stone-500 text-sm">
          {format(new Date(article.createdAt), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      className: "text-right w-[132px]",
      render: (article) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-sky-700"
            onClick={() => setPreviewArticle(article)}
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-emerald-700"
            onClick={() => openEditModal(article)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-red-600"
            onClick={() => setDeleteTarget(article)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={FileText}
        title="Quản lý bài viết"
        description={`${articles.length} bài viết trong hệ thống`}
        action={{ label: "Thêm bài viết", onClick: openCreateModal }}
      />

      {/* Filters */}
      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px_180px] gap-3">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full border-stone-200">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
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

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filteredArticles}
        emptyMessage="Không tìm thấy bài viết nào"
      />

      {/* Quick preview modal */}
      <Modal
        open={!!previewArticle}
        onClose={() => setPreviewArticle(null)}
        title={previewArticle?.title || "Xem nhanh bài viết"}
        description={
          previewArticle
            ? `Tác giả: ${
                previewArticle.author?.username ||
                mockUsers.find((user) => user.id === previewArticle.authorId)
                  ?.username ||
                previewArticle.authorId
              } • ${format(new Date(previewArticle.createdAt), "dd/MM/yy")}`
            : undefined
        }
        size="xl"
        footer={
          <Button variant="outline" onClick={() => setPreviewArticle(null)}>
            Đóng
          </Button>
        }
      >
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-4">
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

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingArticle ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        description={
          editingArticle
            ? "Cập nhật thông tin bài viết"
            : "Điền thông tin để tạo bài viết mới"
        }
        titleClassName="text-xl sm:text-2xl"
        descriptionClassName="text-sm sm:text-base text-stone-600"
        size="xl"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
            >
              {editingArticle ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">Thông tin bài viết</p>
            <p className="text-xs text-stone-500 mt-0.5">Các trường có dấu * là bắt buộc.</p>
          </div>

          {/* Title */}
          <FormField
            type="text"
            label="Tiêu đề"
            name="title"
            required
            value={formData.title}
            onChange={(v) => setFormData((prev) => ({ ...prev, title: v }))}
            placeholder="Nhập tiêu đề bài viết"
          />

          <FormField
            type="text"
            label="Slug"
            name="slug"
            required
            value={formData.slug}
            onChange={(v) => setFormData((prev) => ({ ...prev, slug: v }))}
            placeholder="duong-dan-bai-viet"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <FormField
              type="select"
              label="Danh mục"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, categoryId: v }))
              }
              placeholder="Chọn danh mục"
              options={mockCategories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />

            {/* Status */}
            <FormField
              type="select"
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  status: v as "draft" | "published",
                }))
              }
              options={[
                { label: "Nháp", value: "draft" },
                { label: "Đã đăng", value: "published" },
              ]}
            />
          </div>

          {/* Featured Image */}
          <FormField
            type="text"
            label="Ảnh đại diện (URL)"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, featuredImage: v }))
            }
            placeholder="https://example.com/image.jpg"
          />

          {/* Rich-text editor */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">
              Nội dung <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="min-h-[240px]">
              <Editor
                value={formData.content}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, content: v }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
