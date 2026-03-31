"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, Pencil, Trash2 } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import {
  createRole,
  deleteRole,
  fetchRoles,
  updateRole,
} from "@/services/admin/roles";

// ---------- Form state type ----------
interface RoleFormData {
  name: string;
}

const emptyForm: RoleFormData = {
  name: "",
};

// ---------- Component ----------
export default function RolesPage() {
  // --- data state ---
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        setRoles(await fetchRoles());
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải danh sách vai trò.");
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
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setFormData(emptyForm);
  };

  const isFormValid = useMemo(() => formData.name.trim().length > 0, [formData.name]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSaving(true);
    setErrorMessage("");

    try {
      if (editingRole) {
        await updateRole(editingRole.id, formData.name.trim());
      } else {
        await createRole(formData.name.trim());
      }

      setRoles(await fetchRoles());
      closeModal();
    } catch {
      setErrorMessage("Lưu vai trò thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      await deleteRole(deleteTarget.id);
      setRoles(await fetchRoles());
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa vai trò thất bại.");
    } finally {
      setIsSaving(false);
    }
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
      render: (role) => <span className="font-medium text-stone-900">{role.name}</span>,
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
            onClick={() => setDeleteTarget(role)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shield}
        title="Quản lý vai trò"
        description="Quản lý các vai trò và phân quyền trong hệ thống"
        action={
          isLoading
            ? undefined
            : {
                label: "Thêm vai trò",
                onClick: openCreateModal,
              }
        }
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={roles}
        emptyMessage={isLoading ? "Đang tải dữ liệu..." : "Chưa có vai trò nào"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRole ? "Cập nhật vai trò" : "Thêm vai trò mới"}
        description="Nhập tên vai trò để đồng bộ trực tiếp với backend."
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? "Đang lưu..." : editingRole ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">
              Thông tin vai trò
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Các trường có dấu * là bắt buộc.
            </p>
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
