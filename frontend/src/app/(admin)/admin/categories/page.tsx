"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderTree, Pencil, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import {
  createCategory,
  deleteCategory,
  fetchCategoriesAdmin,
  updateCategory,
} from "@/services/admin/categories";

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
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        setCategories(await fetchCategoriesAdmin());
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
      description: category.description || "",
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
        await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || "",
        });
      } else {
        await createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || "",
        });
      }

      setCategories(await fetchCategoriesAdmin());
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
      await deleteCategory(deleteTarget.id);
      setCategories(await fetchCategoriesAdmin());
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
        <code className="rounded bg-stone-100 px-2 py-0.5 text-sm text-stone-600">
          {category.slug || "--"}
        </code>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      render: (category) => (
        <span className="text-stone-500">{category.description || "--"}</span>
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
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        description="Thông tin sẽ đồng bộ trực tiếp với API categories."
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
                : editingCategory
                  ? "Cập nhật"
                  : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            type="text"
            label="Tên danh mục"
            name="name"
            required
            value={formData.name}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
            placeholder="Nhập tên danh mục"
          />
          <FormField
            type="text"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, slug: value }))
            }
            placeholder="Để trống để backend tự sinh"
          />
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            placeholder="Mô tả ngắn về danh mục"
            rows={3}
          />
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
