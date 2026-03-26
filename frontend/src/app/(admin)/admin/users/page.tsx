"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, EyeOff, Pencil, Search, Trash2, Users } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUser,
  deleteUser,
  fetchRoles,
  fetchUsers,
  getErrorMessage,
  updateUser,
} from "@/services/adminService";
import { Role, User } from "@/types";

interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  phone: string;
  avatarUrl: string;
}

const emptyForm: UserFormData = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  roleId: "",
  phone: "",
  avatarUrl: "",
};

function getInitials(name: string) {
  return name
    .split(/[\s._-]+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [userRows, roleRows] = await Promise.all([
        fetchUsers({ page: 1, pageSize: 200 }),
        fetchRoles(),
      ]);
      setUsers(userRows.data);
      setRoles(roleRows);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        keyword === "" ||
        user.username.toLowerCase().includes(keyword) ||
        (user.fullName || "").toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.phone || "").toLowerCase().includes(keyword);

      const matchesRole = roleFilter === "all" || user.roleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName || "",
      email: user.email,
      password: "",
      roleId: user.roleId,
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData(emptyForm);
    setShowPassword(false);
  };

  const handleSubmit = async () => {
    if (!formData.email.trim() || !formData.fullName.trim() || !formData.roleId) {
      return;
    }

    if (!editingUser && (!formData.username.trim() || !formData.password.trim())) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }

      await loadData();
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
      await deleteUser(deleteTarget.id);
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const getRoleBadgeClass = (roleId: string) => {
    if (roleId === "1") {
      return "border-[hsl(34,62%,76%)] text-[hsl(34,62%,45%)] bg-[linear-gradient(180deg,hsl(34,80%,96%),hsl(34,68%,91%))]";
    }

    if (roleId === "2") {
      return "border-[hsl(150,28%,72%)] text-[hsl(150,46%,33%)] bg-[linear-gradient(180deg,hsl(150,44%,96%),hsl(150,34%,90%))]";
    }

    return "border-[hsl(210,48%,76%)] text-[hsl(210,56%,42%)] bg-[linear-gradient(180deg,hsl(210,78%,96%),hsl(210,66%,91%))]";
  };

  const columns: Column<User>[] = [
    {
      key: "avatar",
      label: "Avatar",
      className: "w-[60px]",
      render: (user) => (
        <Avatar className="h-9 w-9 bg-emerald-100 text-emerald-700">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.username} />}
          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
            {getInitials(user.fullName || user.username)}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (user) => <span className="font-medium text-stone-900">{user.username}</span>,
    },
    {
      key: "fullName",
      label: "Ho ten",
      render: (user) => <span className="text-stone-600">{user.fullName || "--"}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (user) => <span className="text-stone-600">{user.email}</span>,
    },
    {
      key: "role",
      label: "Vai tro",
      render: (user) => (
        <Badge
          variant="secondary"
          className={`border rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${getRoleBadgeClass(user.roleId)}`}
        >
          {user.role?.name || roles.find((role) => role.id === user.roleId)?.name || user.roleId}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngay tao",
      render: (user) => <span className="text-sm text-stone-500">{format(new Date(user.createdAt), "dd/MM/yyyy")}</span>,
    },
    {
      key: "actions",
      label: "Thao tac",
      className: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={() => openEditModal(user)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setDeleteTarget(user)}
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
        icon={Users}
        title="Quan ly nguoi dung"
        description={loading ? "Dang tai nguoi dung..." : `${users.length} tai khoan dang co trong he thong`}
        action={{
          label: "Them nguoi dung",
          onClick: openCreateModal,
        }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tim theo ten, email, username, so dien thoai..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[220px] border-stone-200">
            <SelectValue placeholder="Loc theo vai tro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tat ca</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        emptyMessage={loading ? "Dang tai du lieu..." : "Khong tim thay nguoi dung nao"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        size="lg"
        title={editingUser ? "Cap nhat nguoi dung" : "Them nguoi dung moi"}
        description={editingUser ? "Username hien tai khong doi tren backend." : "Nhap thong tin de tao tai khoan moi."}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Huy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {editingUser ? "Cap nhat" : "Tao moi"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium text-stone-700">
                Username {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="username"
                value={formData.username}
                disabled={!!editingUser}
                onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="Nhap username"
                className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-stone-700">
                Ho ten <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Nhap ho ten"
                className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-stone-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="email@example.com"
                className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-stone-700">So dien thoai</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Nhap so dien thoai"
                className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatarUrl" className="text-sm font-medium text-stone-700">Avatar URL</Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={(event) => setFormData((prev) => ({ ...prev, avatarUrl: event.target.value }))}
              placeholder="/uploads/avatar.jpg hoac URL day du"
              className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-stone-700">
                Mat khau {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder={editingUser ? "De trong neu khong doi" : "Nhap mat khau"}
                  className="pr-11 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">Vai tro <span className="text-red-500">*</span></Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, roleId: value }))}
              >
                <SelectTrigger className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400">
                  <SelectValue placeholder="Chon vai tro" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.username}
      />
    </div>
  );
}
