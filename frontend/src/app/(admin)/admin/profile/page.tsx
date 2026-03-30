"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/services/admin/errors";
import { uploadMedia } from "@/services/admin/media";
import {
  fetchCurrentUser,
  updateCurrentUser,
} from "@/services/admin/profile";
import { User } from "@/types";
import { Camera, Clock4, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck } from "lucide-react";

interface ProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyForm: ProfileForm = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  avatarUrl: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      setForm({
        fullName: user.fullName || "",
        username: user.username,
        email: user.email,
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (user.avatarUrl) {
        localStorage.setItem("admin_avatar", user.avatarUrl);
        window.dispatchEvent(new Event("admin-avatar-updated"));
      }
      localStorage.setItem("admin_display_name", user.fullName || user.username);
      if (user.role?.name) {
        localStorage.setItem("admin_role", user.role.name);
      }
      window.dispatchEvent(new Event("admin-profile-updated"));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const initials = useMemo(() => {
    const name = form.fullName || form.username || "AD";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form.fullName, form.username]);

  const joinedDate = useMemo(() => {
    if (!currentUser?.createdAt) {
      return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(currentUser.createdAt));
  }, [currentUser?.createdAt]);

  const handleChange = <K extends keyof ProfileForm>(field: K) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const togglePasswordVisibility = (field: "currentPassword" | "newPassword" | "confirmPassword") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn tệp ảnh hợp lệ.");
      return;
    }

    try {
      setUploadingAvatar(true);
      setError("");
      setSuccess("");
      await uploadMedia(file);
      await loadProfile();
      setSuccess("Tải avatar thành công. Nếu muốn đổi sang ảnh vừa tải, nhập lại đường dẫn avatar và lưu hồ sơ.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      setSaving(true);
      const user = await updateCurrentUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        avatarUrl: form.avatarUrl,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setCurrentUser(user);
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email,
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      const displayName = user.fullName || user.username;
      localStorage.setItem("admin_display_name", displayName);
      if (user.avatarUrl) {
        localStorage.setItem("admin_avatar", user.avatarUrl);
      } else {
        localStorage.removeItem("admin_avatar");
      }
      window.dispatchEvent(new Event("admin-avatar-updated"));
      if (user.role?.name) {
        localStorage.setItem("admin_role", user.role.name);
      }
      window.dispatchEvent(new Event("admin-profile-updated"));

      setSuccess("Đã cập nhật hồ sơ thành công.");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
          <CardHeader className="pt-0 -mt-10 pb-4">
            <div className="flex flex-col items-start gap-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-white">
                {form.avatarUrl && <AvatarImage src={form.avatarUrl} alt={form.fullName || form.username} />}
                <AvatarFallback className="bg-emerald-700 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <CardTitle className="text-2xl font-bold text-stone-900 leading-tight tracking-tight">
                  {form.fullName || form.username || (loading ? "Đang tải..." : "Người dùng")}
                </CardTitle>
                <p className="mt-1 text-sm text-stone-600">{form.email || "--"}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => void handleAvatarSelect(event)}
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={uploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  {uploadingAvatar ? "Đang tải ảnh..." : "Tải avatar"}
                </Button>
              </div>

              <p className="text-xs text-stone-500">Bạn có thể tải ảnh lên rồi dán đường dẫn vào trường Avatar URL bên phải.</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-stone-700">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-3">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Vai trò: {currentUser?.role?.name || "--"}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Email: {form.email || "--"}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Di động: {form.phone || "--"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-stone-200 space-y-1">
              <p className="text-stone-500">Ngày tạo tài khoản</p>
              <p className="flex items-center gap-2 font-semibold text-stone-800">
                <Clock4 className="w-4 h-4 text-emerald-600" />
                {joinedDate}
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">Tài khoản đang hoạt động</Badge>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-3 border-stone-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold text-stone-900">Thông tin cơ bản</CardTitle>
              <CardDescription className="text-stone-500">
                Cập nhật thông tin đang đăng nhập trực tiếp từ API auth/me.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-stone-700">Họ và tên</Label>
                <Input id="fullName" value={form.fullName} onChange={handleChange("fullName")} className="h-11 border-stone-300 focus-visible:ring-emerald-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-stone-700">Username</Label>
                <Input id="username" value={form.username} disabled className="h-11 bg-stone-50 border-stone-300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={handleChange("email")} className="h-11 border-stone-300 focus-visible:ring-emerald-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700">Số điện thoại</Label>
                <Input id="phone" value={form.phone} onChange={handleChange("phone")} className="h-11 border-stone-300 focus-visible:ring-emerald-600" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avatarUrl" className="text-stone-700">Avatar URL</Label>
                <Input id="avatarUrl" value={form.avatarUrl} onChange={handleChange("avatarUrl")} className="h-11 border-stone-300 focus-visible:ring-emerald-600" placeholder="/uploads/avatar.jpg hoặc URL đầy đủ" />
              </div>
            </CardContent>

            <CardHeader className="pb-0 pt-0">
              <CardTitle className="text-xl font-bold text-stone-900">Đổi mật khẩu</CardTitle>
              <CardDescription className="text-stone-500">
                Nếu đổi mật khẩu, backend sẽ yêu cầu mật khẩu hiện tại.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {([
                ["currentPassword", "Mật khẩu hiện tại"],
                ["newPassword", "Mật khẩu mới"],
                ["confirmPassword", "Xác nhận mật khẩu"],
              ] as const).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-stone-700">{label}</Label>
                  <div className="relative">
                    <Input
                      id={field}
                      type={showPasswords[field] ? "text" : "password"}
                      value={form[field]}
                      onChange={handleChange(field)}
                      className="h-11 border-stone-300 focus-visible:ring-emerald-600 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-stone-200 pt-5">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Lock className="w-4 h-4 text-stone-400" />
                Backend chỉ lưu hash mật khẩu sau khi cập nhật.
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" disabled={saving || loading}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
