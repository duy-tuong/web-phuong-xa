"use client";

import { useCallback, useEffect, useState } from "react";
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
import { getErrorMessage } from "@/services/admin/errors";

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setCategories(await fetchCategoriesAdmin());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

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

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }

      await loadCategories();
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
      await deleteCategory(deleteTarget.id);
      await loadCategories();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      label: "Tên danh mục",
      render: (category) => <span className="font-semibold text-stone-900">{category.name}</span>,
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
      render: (category) => <span className="text-stone-500">{category.description || "--"}</span>,
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-red-600"
            onClick={() => setDeleteTarget(category)}
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
        icon={FolderTree}
        title="Danh mục"
        description={loading ? "Đang tải danh mục..." : `${categories.length} danh mục bài viết`}
        action={{ label: "Thêm danh mục", onClick: openCreateModal }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={categories}
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Chưa có danh mục nào"}
      />

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
              disabled={submitting || !formData.name.trim()}
            >
              {editingCategory ? "Cập nhật" : "Tạo mới"}
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
            onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
            placeholder="Nhập tên danh mục"
          />
          <FormField
            type="text"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
            placeholder="Để trống để backend tự sinh"
          />
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
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
