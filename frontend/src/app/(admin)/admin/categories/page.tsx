"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderTree, Pencil, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { Category } from "@/types";

// ---------------------------------------------------------------------------
// Form data shape
// ---------------------------------------------------------------------------
interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
};

type CategoryApi = {
  id?: number | string;
  Id?: number | string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  slug?: string;
  Slug?: string;
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CategoriesPage() {
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    setAdminRole(localStorage.getItem("admin_role"));
  }, []);

  const isEditor = adminRole === "Editor";

  // ----- data state -----
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ----- modal state -----
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

  // ----- delete state -----
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    const data = Array.isArray(res.data) ? (res.data as CategoryApi[]) : [];
    const mapped = data
      .map((category) => ({
        id: String(category.id ?? category.Id ?? ""),
        name: category.name ?? category.Name ?? "",
        description: category.description ?? category.Description ?? undefined,
        slug: category.slug ?? category.Slug ?? "",
      }))
      .filter((category) => category.id && category.name);
    setCategories(mapped);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchCategories();
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải danh mục.");
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
  // Modal helpers
  // -----------------------------------------------------------------------
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || "",
      description: category.description ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
  };

  // -----------------------------------------------------------------------
  // CRUD handlers
  // -----------------------------------------------------------------------
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
        });
      } else {
        await api.post("/categories", {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
        });
      }

      await fetchCategories();
      closeModal();
    } catch {
      setErrorMessage("Lưu danh mục thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      await fetchCategories();
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa danh mục thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));

  const pagedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // -----------------------------------------------------------------------
  // Table columns
  // -----------------------------------------------------------------------
  const columns: Column<Category>[] = [
    {
      key: "name",
      label: "Tên danh mục",
      render: (category) => (
        <span className="font-semibold text-stone-900">{category.name}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (category) => (
        <code className="text-sm font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
          {category.slug}
        </code>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      render: (category) => (
        <span className="text-stone-500">
          {category.description || "---"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      className: "text-right",
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-emerald-700"
            onClick={() => openEditModal(category)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {!isEditor ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-stone-500 hover:text-red-600"
              onClick={() => setDeleteTarget(category)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : null}
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
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageHeader
        icon={FolderTree}
        title="Danh mục"
        description="Quản lý danh mục bài viết và nội dung"
        action={
          isLoading
            ? undefined
            : { label: "Thêm danh mục", onClick: openCreateModal }
        }
      />

      {/* Data table */}
      <DataTable
        columns={columns}
        data={pagedCategories}
        emptyMessage="Chưa có danh mục nào"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages} • {categories.length} kết quả
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

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        description={
          editingCategory
            ? "Cập nhật thông tin danh mục"
            : "Điền thông tin để tạo danh mục mới"
        }
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
              {isSaving ? "Đang lưu..." : editingCategory ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">Thông tin danh mục</p>
            <p className="text-xs text-stone-500 mt-0.5">Các trường có dấu * là bắt buộc.</p>
          </div>

          {/* Name */}
          <FormField
            type="text"
            label="Tên danh mục"
            name="name"
            required
            value={formData.name}
            onChange={(v) => setFormData((prev) => ({ ...prev, name: v }))}
            placeholder="Nhập tên danh mục"
          />

          {/* Slug */}
          <FormField
            type="text"
            label="Slug"
            name="slug"
            required
            value={formData.slug}
            onChange={(v) => setFormData((prev) => ({ ...prev, slug: v }))}
            placeholder="ten-danh-muc"
          />

          {/* Description */}
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, description: v }))
            }
            placeholder="Mô tả ngắn về danh mục"
            rows={3}
          />
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
