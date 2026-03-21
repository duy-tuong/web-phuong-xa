"use client";

import { useState } from "react";
import { Shield, Pencil, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { mockRoles } from "@/lib/mock-data";
import { Role } from "@/types";

// ---------- Form state type ----------
interface RoleFormData {
  name: string;
  description: string;
}

const emptyForm: RoleFormData = {
  name: "",
  description: "",
};

// ---------- Component ----------
export default function RolesPage() {
  // --- data state ---
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  // --- modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>(emptyForm);

  // --- delete state ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // ---------- Modal handlers ----------
  const openCreateModal = () => {
    setEditingRole(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setFormData(emptyForm);
  };

  const handleSubmit = () => {
    if (editingRole) {
      // Update existing role
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: formData.name,
                description: formData.description || undefined,
              }
            : r
        )
      );
    } else {
      // Create new role
      const newRole: Role = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description || undefined,
      };
      setRoles((prev) => [...prev, newRole]);
    }

    closeModal();
  };

  // ---------- Delete handlers ----------
  const openDeleteModal = (role: Role) => {
    setDeletingRole(role);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletingRole) return;
    setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
    setDeletingRole(null);
  };

  // ---------- Form field updater ----------
  const updateField = (field: keyof RoleFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- Table columns ----------
  const columns: Column<Role>[] = [
    {
      key: "name",
      label: "Tên vai trò",
      render: (role) => (
        <span className="font-medium text-stone-900">{role.name}</span>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      render: (role) => (
        <span className="text-stone-600">
          {role.description ?? "Không có mô tả"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      className: "text-right",
      render: (role) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={() => openEditModal(role)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => openDeleteModal(role)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ---------- Check if form is valid ----------
  const isFormValid = formData.name.trim() !== "";

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={Shield}
        title="Quản lý vai trò"
        description="Quản lý các vai trò và phân quyền trong hệ thống"
        action={{
          label: "Thêm vai trò",
          onClick: openCreateModal,
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={roles}
        emptyMessage="Chưa có vai trò nào"
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
        description={
          editingRole
            ? "Cập nhật thông tin vai trò"
            : "Điền thông tin để tạo vai trò mới"
        }
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              {editingRole ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">Thông tin vai trò</p>
            <p className="text-xs text-stone-500 mt-0.5">Các trường có dấu * là bắt buộc.</p>
          </div>

          <FormField
            type="text"
            label="Tên vai trò"
            name="name"
            required
            value={formData.name}
            onChange={updateField("name")}
            placeholder="Nhập tên vai trò"
          />
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={updateField("description")}
            placeholder="Nhập mô tả cho vai trò"
            rows={3}
          />
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingRole(null);
        }}
        onConfirm={handleDelete}
        itemName={deletingRole?.name}
      />
    </div>
  );
}
