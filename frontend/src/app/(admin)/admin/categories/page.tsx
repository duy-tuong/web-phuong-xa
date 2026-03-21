"use client";

import { useState } from "react";
import { FolderTree, Pencil, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { mockCategories } from "@/lib/mock-data";
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

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CategoriesPage() {
  // ----- data state -----
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  // ----- modal state -----
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

  // ----- delete state -----
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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
  const handleSave = () => {
    if (!formData.name.trim() || !formData.slug.trim()) return;

    if (editingCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
              }
            : c
        )
      );
    } else {
      // Create new
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
      };
      setCategories((prev) => [newCategory, ...prev]);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

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

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={FolderTree}
        title="Danh mục"
        description="Quản lý danh mục bài viết và nội dung"
        action={{ label: "Thêm danh mục", onClick: openCreateModal }}
      />

      {/* Data table */}
      <DataTable
        columns={columns}
        data={categories}
        emptyMessage="Chưa có danh mục nào"
      />

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
            >
              {editingCategory ? "Cập nhật" : "Tạo mới"}
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
