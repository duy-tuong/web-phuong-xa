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
  getErrorMessage,
  updateCategory,
} from "@/services/adminService";

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
      label: "Ten danh muc",
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
      label: "Mo ta",
      render: (category) => <span className="text-stone-500">{category.description || "--"}</span>,
    },
    {
      key: "actions",
      label: "Thao tac",
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
        title="Danh muc"
        description={loading ? "Dang tai danh muc..." : `${categories.length} danh muc bai viet`}
        action={{ label: "Them danh muc", onClick: openCreateModal }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={categories}
        emptyMessage={loading ? "Dang tai du lieu..." : "Chua co danh muc nao"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingCategory ? "Cap nhat danh muc" : "Them danh muc moi"}
        description="Thong tin se dong bo truc tiep voi API categories."
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Huy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
              disabled={submitting || !formData.name.trim()}
            >
              {editingCategory ? "Cap nhat" : "Tao moi"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            type="text"
            label="Ten danh muc"
            name="name"
            required
            value={formData.name}
            onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
            placeholder="Nhap ten danh muc"
          />
          <FormField
            type="text"
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
            placeholder="de trong de backend tu sinh"
          />
          <FormField
            type="textarea"
            label="Mo ta"
            name="description"
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            placeholder="Mo ta ngan ve danh muc"
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
