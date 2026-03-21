"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";
import {
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Clock4,
  Eye,
  EyeOff,
} from "lucide-react";

const currentUser = mockUsers[0];

interface ProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    fullName: currentUser.fullName || "Admin",
    username: currentUser.username,
    email: currentUser.email,
    phone: "0900 000 000",
    bio: "Quản trị viên hệ thống phường Cao Lãnh.",
    role: currentUser.role?.name || "Quản trị viên",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarSrc, setAvatarSrc] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("admin_avatar") || "" : "")
  );
  const [avatarError, setAvatarError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = useMemo(() => {
    if (form.fullName) {
      return form.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "AD";
  }, [form.fullName]);

  const joinedDate = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(currentUser.createdAt));
  }, []);

  const handleChange = <K extends keyof ProfileForm>(field: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const togglePasswordVisibility = (
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Ảnh đại diện phải nhỏ hơn 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextSrc = typeof reader.result === "string" ? reader.result : "";
      if (!nextSrc) return;

      localStorage.setItem("admin_avatar", nextSrc);
      window.dispatchEvent(new Event("admin-avatar-updated"));
      setAvatarSrc(nextSrc);
      setAvatarError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    localStorage.removeItem("admin_avatar");
    window.dispatchEvent(new Event("admin-avatar-updated"));
    setAvatarSrc("");
    setAvatarError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder submit handler for UI-only mock
    console.log("Profile saved", form);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-4 py-4 sm:px-6">
        <div className="absolute -right-14 -top-12 h-40 w-40 rounded-full bg-emerald-100/70 blur-2xl" />
        <div className="absolute -left-14 -bottom-14 h-40 w-40 rounded-full bg-amber-100/60 blur-2xl" />
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm sm:text-base font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Khu vực quản trị
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
              Tinh chỉnh hồ sơ để nâng cao nhận diện tài khoản admin
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Cập nhật thông tin, đổi ảnh đại diện và bảo mật trong giao diện.
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
          <CardHeader className="pt-0 -mt-10 pb-4">
            <div className="flex flex-col items-start gap-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-white">
                {avatarSrc && <AvatarImage src={avatarSrc} alt={form.fullName} />}
                <AvatarFallback className="bg-emerald-700 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <CardTitle className="text-2xl font-bold text-stone-900 leading-tight tracking-tight">
                  {form.fullName}
                </CardTitle>
                <p className="text-sm text-stone-600 mt-1">{form.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  Đổi ảnh đại diện
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-stone-300 text-stone-600"
                  onClick={handleRemoveAvatar}
                >
                  Xóa ảnh
                </Button>
              </div>

              <p className="text-xs text-stone-500">
                Chấp nhận JPG, PNG, WEBP. Dung lượng tối đa 2MB.
              </p>
              {avatarError && (
                <p className="text-xs text-red-600 font-medium">{avatarError}</p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-stone-700">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-3">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Vai trò: {form.role}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Email quản trị: {form.email}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Di động: {form.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-stone-200 space-y-1">
              <p className="text-stone-500">Gia nhập hệ thống</p>
              <p className="font-semibold text-stone-800 flex items-center gap-2">
                <Clock4 className="w-4 h-4 text-emerald-600" />
                {joinedDate}
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
              Hồ sơ đang hoạt động
            </Badge>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-3 border-stone-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold text-stone-900">Thông tin cơ bản</CardTitle>
              <CardDescription className="text-stone-500">
                Cập nhật tên hiển thị, liên hệ và phần mô tả cá nhân.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-stone-700">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Nhập họ tên"
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-stone-700">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={form.username}
                  disabled
                  className="h-11 bg-stone-50 border-stone-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="0900 000 000"
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="text-stone-700">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={handleChange("bio")}
                  placeholder="Mô tả ngắn về vai trò và trách nhiệm của bạn"
                  className="min-h-[110px] border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>
            </CardContent>

            <CardHeader className="pb-0 pt-0">
              <CardTitle className="text-xl font-bold text-stone-900">Bảo mật tài khoản</CardTitle>
              <CardDescription className="text-stone-500">
                Đổi mật khẩu định kỳ để tăng cường an toàn cho khu vực quản trị.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-stone-700">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.currentPassword ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={handleChange("currentPassword")}
                    placeholder="********"
                    className="h-11 border-stone-300 focus-visible:ring-emerald-600 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label={showPasswords.currentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPasswords.currentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-stone-700">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.newPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    placeholder="********"
                    className="h-11 border-stone-300 focus-visible:ring-emerald-600 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label={showPasswords.newPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-stone-700">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="********"
                    className="h-11 border-stone-300 focus-visible:ring-emerald-600 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label={showPasswords.confirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-stone-200 pt-5">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Lock className="w-4 h-4 text-stone-400" />
                Mật khẩu được mã hóa an toàn
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-stone-600 w-1/2 sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 w-1/2 sm:w-auto"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
