"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Search, Trash2, Users } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { resolveApiAssetUrl } from "@/lib/api-base-url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type RoleApi = {
  id?: number | string;
  Id?: number | string;
  name?: string;
  Name?: string;
};

type UserApi = {
  id?: number | string;
  Id?: number | string;
  username?: string;
  Username?: string;
  email?: string;
  Email?: string;
  phone?: string;
  Phone?: string;
  fullName?: string;
  FullName?: string;
  roleId?: number | string;
  RoleId?: number | string;
  role?: string;
  Role?: string;
  createdAt?: string;
  CreatedAt?: string;
  avatarUrl?: string;
  AvatarUrl?: string;
};

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
  // --- data state ---
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- search & filter ---
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    const raw = Array.isArray(res.data) ? (res.data as RoleApi[]) : [];
    const nextRoles = raw
      .map((role) => ({
        id: String(role.id ?? role.Id ?? ""),
        name: role.name ?? role.Name ?? "",
      }))
      .filter((role: Role) => role.id && role.name);
    setRoles(nextRoles);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      params: { page: 1, pageSize: 1000 },
    });
    const data = (res.data?.data ?? []) as UserApi[];
    const mapped = data.map((user) => ({
      id: String(user.id ?? user.Id ?? ""),
      username: user.username ?? user.Username ?? "",
      email: user.email ?? user.Email ?? "",
      fullName: user.fullName ?? user.FullName ?? undefined,
      phone: user.phone ?? user.Phone ?? undefined,
      roleId: String(user.roleId ?? user.RoleId ?? ""),
      role: {
        id: String(user.roleId ?? user.RoleId ?? ""),
        name: user.role ?? user.Role ?? "",
      },
      createdAt: user.createdAt ?? user.CreatedAt ?? new Date().toISOString(),
      avatarUrl: user.avatarUrl ?? user.AvatarUrl ?? undefined,
      avatar: user.avatarUrl ?? user.AvatarUrl ?? undefined,
    })) as User[];
    setUsers(mapped);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await Promise.all([fetchRoles(), fetchUsers()]);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không thể tải danh sách người dùng.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const usersSummary = useMemo(() => {
    const todayShort = format(new Date(), "dd/MM/yy");
    return `${users.length} người dùng trong hệ thống • ${todayShort}`;
  }, [users.length]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const resolvedRoleId =
        user.roleId ||
        roles.find((role) => role.name === user.role?.name)?.id ||
        "";
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        (user.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || resolvedRoleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter, roles]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

  const isFormValid = useMemo(() => {
    const hasUsername = formData.username.trim().length > 0;
    const hasEmail = formData.email.trim().length > 0;
    const hasRole = formData.roleId.trim().length > 0;
    const hasPassword = editingUser
      ? true
      : formData.password.trim().length > 0;
    return hasUsername && hasEmail && hasRole && hasPassword;
  }, [editingUser, formData]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!isFormValid) {
      return;
    }

    const roleId = Number(formData.roleId);
    if (!Number.isFinite(roleId)) {
      setErrorMessage("Vui lòng chọn vai trò hợp lệ.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
          roleId,
          ...(formData.password.trim()
            ? { password: formData.password.trim() }
            : {}),
        });
      } else {
        await api.post("/users", {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          fullName: formData.fullName.trim(),
          roleId,
        });
      }

      await fetchUsers();
      closeModal();
    } catch {
      setErrorMessage("Lưu người dùng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      await fetchUsers();
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa người dùng thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Form field updater ----------
  const updateField = (field: keyof UserFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleBadgeClass = (roleId: string, roleName?: string) => {
    if (roleName === "Admin" || roleId === "1") {
      return "border-[hsl(34,62%,76%)] text-[hsl(34,62%,45%)] bg-[linear-gradient(180deg,hsl(34,80%,96%),hsl(34,68%,91%))]";
    }

    if (roleName === "Editor" || roleId === "2") {
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
          {user.avatarUrl || user.avatar ? (
            <AvatarImage
              src={resolveApiAssetUrl(user.avatarUrl || user.avatar)}
              alt={user.username}
            />
          ) : null}
          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
            {getInitials(user.fullName || user.username)}
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
      label: "Ho ten",
      render: (user) => (
        <span className="text-stone-600">{user.fullName || "--"}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user) => <span className="text-stone-600">{user.email}</span>,
    },
    {
      key: "role",
      label: "Vai trò",
      render: (user) => {
        const roleName =
          user.role?.name ||
          roles.find((role) => role.id === user.roleId)?.name ||
          user.roleId;

        return (
          <Badge
            variant="secondary"
            className={`border rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${getRoleBadgeClass(user.roleId, roleName)}`}
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
      {/* Page Header */}
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageHeader
        icon={Users}
        title="Quản lý người dùng"
        description={usersSummary}
        action={
          isLoading
            ? undefined
            : {
                label: "Thêm người dùng mới",
                onClick: openCreateModal,
              }
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tìm theo tên, email, username, số điện thoại..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px] border-stone-200">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
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
        data={pagedUsers}
        emptyMessage="Không tìm thấy người dùng nào"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages} • {filteredUsers.length} kết quả
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[110px] border-stone-200">
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        size="lg"
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        description={
          editingUser
            ? "Username hiện tại không được đổi."
            : "Nhập thông tin để tạo tài khoản mới."
        }
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSubmit}
              disabled={isSaving || !isFormValid}
            >
              {editingUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">
              Thông tin tài khoản
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Các trường có dấu * là bắt buộc.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-stone-700"
            >
              Tên đăng nhập
              <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              disabled={!!editingUser}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              placeholder="Nhập tên đăng nhập"
              className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
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
            <Label
              htmlFor="password"
              className="text-sm font-medium text-stone-700"
            >
              Mật khẩu
              {!editingUser && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder={
                  editingUser
                    ? "Để trống nếu không đổi mật khẩu"
                    : "Nhập mật khẩu"
                }
                className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {editingUser && (
              <p className="text-xs text-stone-500">
                Để trống nếu không muốn đổi mật khẩu.
              </p>
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
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />
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
