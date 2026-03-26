"use client";

import { useCallback, useEffect, useState } from "react";
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
  getErrorMessage,
  updateRole,
} from "@/services/adminService";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setRoles(await fetchRoles());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleName("");
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setRoleName("");
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingRole) {
        await updateRole(editingRole.id, roleName);
      } else {
        await createRole(roleName);
      }

      await loadRoles();
      closeModal();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
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
      await deleteRole(deleteTarget.id);
      await loadRoles();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Role>[] = [
    {
      key: "name",
      label: "Ten vai tro",
      render: (role) => <span className="font-medium text-stone-900">{role.name}</span>,
    },
    {
      key: "description",
      label: "Mo ta",
      render: (role) => (
        <span className="text-stone-600">
          {role.name === "Admin"
            ? "Vai tro quan tri he thong"
            : role.name === "Editor"
              ? "Vai tro quan ly noi dung"
              : "Vai tro tuy chinh"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tac",
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
        title="Quan ly vai tro"
        description={loading ? "Dang tai vai tro..." : `${roles.length} vai tro dang co trong he thong`}
        action={{
          label: "Them vai tro",
          onClick: openCreateModal,
        }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={roles}
        emptyMessage={loading ? "Dang tai du lieu..." : "Chua co vai tro nao"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRole ? "Cap nhat vai tro" : "Them vai tro moi"}
        description="Nhap ten vai tro de dong bo truc tiep voi backend."
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Huy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSubmit}
              disabled={submitting || !roleName.trim()}
            >
              {editingRole ? "Cap nhat" : "Tao moi"}
            </Button>
          </div>
        }
      >
        <FormField
          type="text"
          label="Ten vai tro"
          name="roleName"
          required
          value={roleName}
          onChange={setRoleName}
          placeholder="Nhap ten vai tro"
        />
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
