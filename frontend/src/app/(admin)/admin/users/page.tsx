"use client";

import { useState, useMemo } from "react";
import { Users, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers, mockRoles } from "@/lib/mock-data";
import { User } from "@/types";

// ---------- Form state type ----------
interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

const emptyForm: UserFormData = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  roleId: "",
};

// ---------- Helpers ----------
function getInitials(name: string): string {
  return name
    .split(/[\s._-]+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------- Component ----------
export default function UsersPage() {
  // --- data state ---
  const [users, setUsers] = useState<User[]>(mockUsers);

  // --- search & filter ---
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // --- modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);

  // --- delete state ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const usersSummary = useMemo(() => {
    const todayShort = format(new Date(), "dd/MM/yy");
    return `${users.length} người dùng trong hệ thống • ${todayShort}`;
  }, [users.length]);

  // ---------- Filtered data ----------
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        (user.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.roleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ---------- Modal handlers ----------
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

  const handleSubmit = () => {
    const selectedRole = mockRoles.find((r) => r.id === formData.roleId);
    if (!selectedRole) return;

    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                username: formData.username,
                fullName: formData.fullName || undefined,
                email: formData.email,
                roleId: selectedRole.id,
                role: selectedRole,
                updatedAt: new Date().toISOString(),
              }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: String(Date.now()),
        username: formData.username,
        fullName: formData.fullName || undefined,
        email: formData.email,
        roleId: selectedRole.id,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }

    closeModal();
  };

  // ---------- Delete handlers ----------
  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
  };

  // ---------- Form field updater ----------
  const updateField = (field: keyof UserFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // ---------- Table columns ----------
  const columns: Column<User>[] = [
    {
      key: "avatar",
      label: "Avatar",
      className: "w-[60px]",
      render: (user) => (
        <Avatar className="h-9 w-9 bg-emerald-100 text-emerald-700">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (user) => (
        <span className="font-medium text-stone-900">{user.username}</span>
      ),
    },
    {
      key: "fullName",
      label: "Họ tên",
      render: (user) => (
        <span className="text-stone-600">{user.fullName || "---"}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user) => (
        <span className="text-stone-600">{user.email}</span>
      ),
    },
    {
      key: "role",
      label: "Vai trò",
      render: (user) => {
        const roleName =
          user.role?.name ||
          mockRoles.find((role) => role.id === user.roleId)?.name ||
          user.roleId;

        return (
          <Badge
            variant="secondary"
            className={`border rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${getRoleBadgeClass(user.roleId)}`}
          >
            {roleName}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (user) => (
        <span className="text-sm text-stone-500">
          {format(new Date(user.createdAt), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
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
            onClick={() => openDeleteModal(user)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ---------- Check if form is valid ----------
  const isFormValid =
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.roleId !== "" &&
    (editingUser !== null || formData.password.trim() !== "");

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={Users}
        title="Quản lý người dùng"
        description={usersSummary}
        action={{
          label: "Thêm người dùng mới",
          onClick: openCreateModal,
        }}
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tìm kiếm theo tên, họ tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px] border-stone-200">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {mockRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        emptyMessage="Không tìm thấy người dùng nào"
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        size="lg"
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        description={
          editingUser
            ? "Cập nhật thông tin tài khoản người dùng"
            : "Điền thông tin để tạo tài khoản mới"
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
              {editingUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">Thông tin tài khoản</p>
            <p className="text-xs text-stone-500 mt-0.5">Các trường có dấu * là bắt buộc.</p>
          </div>

          <FormField
            type="text"
            label="Tên đăng nhập"
            name="username"
            required
            value={formData.username}
            onChange={updateField("username")}
            placeholder="Nhập tên đăng nhập"
          />
          <FormField
            type="text"
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={updateField("fullName")}
            placeholder="Nhập họ và tên"
          />
          <FormField
            type="email"
            label="Email"
            name="email"
            required
            value={formData.email}
            onChange={updateField("email")}
            placeholder="Nhập địa chỉ email"
          />
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-stone-700">
              Mật khẩu
              {!editingUser && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password")(e.target.value)}
                placeholder={
                  editingUser
                    ? "Để trống nếu không muốn đổi mật khẩu"
                    : "Nhập mật khẩu"
                }
                className="pr-11 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {editingUser && (
              <p className="text-xs text-stone-500">Để trống nếu không muốn đổi mật khẩu.</p>
            )}
          </div>

          <FormField
            type="select"
            label="Vai trò"
            name="roleId"
            required
            value={formData.roleId}
            onChange={updateField("roleId")}
            placeholder="Chọn vai trò"
            options={mockRoles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDelete}
        itemName={deletingUser?.username}
      />
    </div>
  );
}
