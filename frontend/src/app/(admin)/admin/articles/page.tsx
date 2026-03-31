"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Eye,
  FileText,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import Editor from "@/components/admin/Editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Article, Category } from "@/types";

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: "draft" | "published";
  featuredImage: string;
  isFeatured: boolean;
}

const emptyForm: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryId: "",
  status: "draft",
  featuredImage: "",
  isFeatured: false,
};

type ArticleApi = {
  id?: number | string;
  Id?: number | string;
  title?: string;
  Title?: string;
  slug?: string;
  Slug?: string;
  excerpt?: string;
  Excerpt?: string;
  featuredImage?: string;
  FeaturedImage?: string;
  content?: string;
  Content?: string;
  status?: string;
  Status?: string;
  isFeatured?: boolean;
  IsFeatured?: boolean;
  createdAt?: string;
  CreatedAt?: string;
  publishedAt?: string | null;
  PublishedAt?: string | null;
  categoryId?: number | string;
  CategoryId?: number | string;
  category?: string;
  Category?: string;
  authorId?: number | string;
  AuthorId?: number | string;
  author?: string;
  Author?: string;
};

type CategoryApi = {
  id?: number | string;
  Id?: number | string;
  name?: string;
  Name?: string;
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ArticlesPage() {
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    setAdminRole(localStorage.getItem("admin_role"));
  }, []);

  const isEditor = adminRole === "Editor";

  // ----- data state -----
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(emptyForm);
  const [imageError, setImageError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- delete state -----
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const resolvePublicUrl = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    const base = api.defaults.baseURL ?? "";
    const origin = base.replace(/\/api\/?$/, "");
    return origin ? `${origin}${value}` : value;
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    const data = Array.isArray(res.data) ? (res.data as CategoryApi[]) : [];
    const mapped = data
      .map((category) => ({
        id: String(category.id ?? category.Id ?? ""),
        name: category.name ?? category.Name ?? "",
      }))
      .filter((category: Category) => category.id && category.name);
    setCategories(mapped);
  };

  const fetchArticles = async () => {
    const res = await api.get("/articles/admin");
    const data = Array.isArray(res.data) ? (res.data as ArticleApi[]) : [];
    const mapped = data.map((article) => ({
      id: String(article.id ?? article.Id ?? ""),
      title: article.title ?? article.Title ?? "",
      slug: article.slug ?? article.Slug ?? "",
      content: article.content ?? article.Content ?? "",
      categoryId: String(article.categoryId ?? article.CategoryId ?? ""),
      status:
        (article.status ?? article.Status ?? "draft").toLowerCase() ===
        "published"
          ? "published"
          : "draft",
      featuredImage:
        article.featuredImage ?? article.FeaturedImage ?? undefined,
      isFeatured: article.isFeatured ?? article.IsFeatured ?? false,
      createdAt:
        article.createdAt ?? article.CreatedAt ?? new Date().toISOString(),
      publishedAt: article.publishedAt ?? article.PublishedAt ?? null,
      category: {
        id: String(article.categoryId ?? article.CategoryId ?? ""),
        name: article.category ?? article.Category ?? "",
      },
      authorId: String(article.authorId ?? article.AuthorId ?? ""),
      author: {
        id: String(article.authorId ?? article.AuthorId ?? ""),
        username: article.author ?? article.Author ?? "",
        email: "",
        roleId: "",
        createdAt: new Date().toISOString(),
      },
      excerpt: article.excerpt ?? article.Excerpt ?? undefined,
    })) as Article[];
    setArticles(mapped);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await Promise.all([fetchCategories(), fetchArticles()]);
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải danh sách bài viết.");
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

  // -----------------------------------------------------------------------
  // Filtered articles
  // -----------------------------------------------------------------------
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        keyword === "" ||
        article.title.toLowerCase().includes(keyword) ||
        (article.slug || "").toLowerCase().includes(keyword) ||
        (article.author?.fullName || article.author?.username || "")
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        categoryFilter === "all" || article.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || article.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, categoryFilter, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));

  const pagedArticles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // -----------------------------------------------------------------------
  // Modal helpers
  // -----------------------------------------------------------------------
  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData(emptyForm);
    setImageError("");
    setModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug ?? "",
      excerpt: article.excerpt ?? "",
      content: article.content,
      categoryId: article.categoryId,
      status: article.status,
      featuredImage: article.featuredImage ?? "",
      isFeatured: article.isFeatured ?? false,
    });
    setImageError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArticle(null);
    setFormData(emptyForm);
    setImageError("");
  };

  const handleFeaturedImageSelect = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Ảnh đại diện phải nhỏ hơn 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await api.post("/media/upload", uploadData);
      const relativeUrl: string | undefined = res.data?.url;
      if (!relativeUrl) {
        throw new Error("Upload failed");
      }

      setFormData((prev) => ({ ...prev, featuredImage: relativeUrl }));
    } catch {
      setImageError("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------------------------------------------------
  // CRUD handlers
  // -----------------------------------------------------------------------
  const buildExcerpt = (content: string) => {
    const plain = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return plain.length > 160 ? `${plain.slice(0, 160)}...` : plain;
  };

  const stripHtml = (content: string) =>
    content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.categoryId) return;

    const categoryId = Number(formData.categoryId);
    if (!Number.isFinite(categoryId)) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || null,
        content: formData.content,
        featuredImage: formData.featuredImage.trim() || null,
        excerpt: formData.excerpt.trim() || buildExcerpt(formData.content),
        categoryId,
        status: formData.status === "published" ? "Published" : "Draft",
        isFeatured: formData.isFeatured,
      };

      if (editingArticle) {
        await api.put(`/articles/${editingArticle.id}`, payload);
        if (formData.status === "published" && !isEditor) {
          await api.put(`/articles/${editingArticle.id}/publish`);
        }
      } else {
        await api.post("/articles", payload);
      }

      await fetchArticles();
      closeModal();
    } catch {
      setErrorMessage("Lưu bài viết thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      await api.delete(`/articles/${deleteTarget.id}`);
      await fetchArticles();
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa bài viết thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (article: Article) => {
    if (isEditor || article.status === "published") return;

    setErrorMessage("");
    setPublishingId(article.id);
    try {
      await api.put(`/articles/${article.id}/publish`);
      await fetchArticles();
    } catch {
      setErrorMessage("Đăng bài viết thất bại.");
    } finally {
      setPublishingId(null);
    }
  };

  const columns: Column<Article>[] = [
    {
      key: "title",
      label: "Tiêu đề",
      className: "min-w-[300px] max-w-[360px]",
      render: (article) => (
        <span className="line-clamp-1 font-semibold text-stone-900">
          {article.title}
        </span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (article) => (
        <code className="text-sm font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
          {article.slug || "---"}
        </code>
      ),
    },
    {
      key: "category",
      label: "Danh mục",
      render: (article) => (
        <Badge variant="secondary" className="font-normal">
          {article.category?.name ||
            categories.find((category) => category.id === article.categoryId)
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
      key: "isFeatured",
      label: "Nổi bật",
      render: (article) =>
        article.isFeatured ? (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Nổi bật
          </Badge>
        ) : (
          <span className="text-stone-400">---</span>
        ),
    },
    {
      key: "author",
      label: "Tác giả",
      render: (article) => (
        <span className="text-stone-600">
          {article.author?.username || article.authorId}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (article) => (
        <span className="text-sm text-stone-500">
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
          {!isEditor && article.status !== "published" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-stone-500 hover:text-emerald-700"
              onClick={() => handlePublish(article)}
              title="Đăng bài"
              disabled={publishingId === article.id}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : null}
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
          {isEditor ? null : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-stone-500 hover:text-red-600"
              onClick={() => setDeleteTarget(article)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageHeader
        icon={FileText}
        title="Quản lý bài viết"
        description={`${articles.length} bài viết trong hệ thống`}
        action={
          isLoading
            ? undefined
            : { label: "Thêm bài viết", onClick: openCreateModal }
        }
      />

      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px_180px] gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Tìm theo tiêu đề, slug, tác giả..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          {/* Category filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full border-stone-200">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
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
        data={pagedArticles}
        emptyMessage="Không tìm thấy bài viết nào"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages} • {filteredArticles.length} kết quả
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
            disabled={page <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Quick preview modal */}
      <Modal
        open={!!previewArticle}
        onClose={() => setPreviewArticle(null)}
        title={previewArticle?.title || "Xem nhanh bài viết"}
        description={
          previewArticle
            ? `Tác giả: ${
                previewArticle.author?.username || previewArticle.authorId
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
          {previewArticle?.featuredImage ? (
            <Image
              src={resolvePublicUrl(previewArticle.featuredImage)}
              alt={previewArticle.title}
              width={1200}
              height={600}
              sizes="100vw"
              unoptimized
              className="mb-4 h-auto w-full rounded-lg border border-stone-200 object-cover"
            />
          ) : null}
          {previewArticle ? (
            <div className="mb-4 rounded-md border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800">
              {previewArticle.excerpt?.trim() ||
                buildExcerpt(previewArticle.content || "") ||
                "Chưa có tóm tắt."}
            </div>
          ) : null}
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
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? "Đang lưu..."
                : editingArticle
                  ? "Cập nhật"
                  : "Tạo mới"}
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
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, title: value }))
            }
            placeholder="Nhập tiêu đề bài viết"
          />

          <FormField
            type="text"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(v) => setFormData((prev) => ({ ...prev, slug: v }))}
            placeholder="slug-bai-viet"
          />

          <FormField
            type="textarea"
            label="Tóm tắt"
            name="excerpt"
            value={formData.excerpt}
            onChange={(v) => setFormData((prev) => ({ ...prev, excerpt: v }))}
            placeholder="Tóm tắt ngắn nội dung bài viết"
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />

            {/* Status */}
            {!isEditor ? (
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
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  isFeatured: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-400"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-stone-700"
            >
              Tin nổi bật
            </label>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Ảnh đại diện
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFeaturedImageSelect}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingImage}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingImage ? "Đang tải..." : "Tải ảnh từ máy"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-stone-600"
                onClick={handleRemoveFeaturedImage}
              >
                Xóa ảnh
              </Button>
            </div>
            {imageError ? (
              <p className="text-xs text-red-600 font-medium">{imageError}</p>
            ) : null}
            {formData.featuredImage ? (
              <Image
                src={resolvePublicUrl(formData.featuredImage)}
                alt="Ảnh đại diện bài viết"
                width={1200}
                height={600}
                sizes="100vw"
                unoptimized
                className="h-40 w-full rounded-lg border border-stone-200 object-cover"
              />
            ) : null}
            <FormField
              type="text"
              label="Hoặc nhập URL ảnh"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, featuredImage: v }))
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">
              Nội dung <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="min-h-[240px]">
              <Editor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
              />
            </div>
            <p className="text-xs text-stone-500">
              Tóm tắt sẽ được backend tự tạo từ nội dung nếu để trống.
            </p>
          </div>

          {formData.content && (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
              <span className="font-semibold text-stone-800">
                Xem nhanh văn bản:
              </span>{" "}
              {stripHtml(formData.content).slice(0, 180) ||
                "Nội dung đang rỗng"}
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
