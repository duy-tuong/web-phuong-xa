"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
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

interface ProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
  roleId: number | null;
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
  role: "",
  roleId: null,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [userId, setUserId] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data ?? {};

        if (!isMounted) return;

        setUserId(typeof data.id === "number" ? data.id : null);
        setCreatedAt(data.createdAt ?? null);
        setForm((prev) => ({
          ...prev,
          fullName: data.fullName ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          avatarUrl: data.avatarUrl ?? "",
          role: data.role ?? "",
          roleId: typeof data.roleId === "number" ? data.roleId : null,
        }));

        const nextAvatar = resolvePublicUrl(data.avatarUrl ?? "");
        setAvatarSrc(nextAvatar);
        if (typeof window !== "undefined") {
          if (nextAvatar) {
            localStorage.setItem("admin_avatar", nextAvatar);
          } else {
            localStorage.removeItem("admin_avatar");
          }
          window.dispatchEvent(new Event("admin-avatar-updated"));
        }
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không thể tải thông tin hồ sơ.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
    if (!createdAt) {
      return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(createdAt));
  }, [createdAt]);

  const resolvePublicUrl = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    const base = api.defaults.baseURL ?? "";
    const origin = base.replace(/\/api\/?$/, "");
    return origin ? `${origin}${value}` : value;
  };

  const handleChange =
    <K extends keyof ProfileForm>(field: K) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const togglePasswordVisibility = (
    field: "currentPassword" | "newPassword" | "confirmPassword",
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAvatarSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setSuccessMessage("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Vui lòng chọn tệp ảnh hợp lệ.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Ảnh đại diện phải nhỏ hơn 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/media/avatar", formData);
      const relativeUrl: string | undefined = res.data?.url;
      if (!relativeUrl) {
        throw new Error("Upload failed");
      }

      const publicUrl = resolvePublicUrl(relativeUrl);
      setAvatarSrc(publicUrl);
      setForm((prev) => ({ ...prev, avatarUrl: relativeUrl }));

      if (typeof window !== "undefined") {
        localStorage.setItem("admin_avatar", publicUrl);
        window.dispatchEvent(new Event("admin-avatar-updated"));
      }
    } catch {
      setAvatarError("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_avatar");
      window.dispatchEvent(new Event("admin-avatar-updated"));
    }
    setAvatarSrc("");
    setForm((prev) => ({ ...prev, avatarUrl: "" }));
    setAvatarError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!userId || !form.roleId) {
      setErrorMessage("Không thể xác định tài khoản hiện tại.");
      return;
    }

    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        setErrorMessage("Vui lòng nhập mật khẩu hiện tại.");
        return;
      }

      if (
        form.newPassword.length < 6 ||
        !/[A-Z]/.test(form.newPassword) ||
        !/\d/.test(form.newPassword)
      ) {
        setErrorMessage("Mật khẩu mới phải ít nhất 6 ký tự, có chữ hoa và số.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không khớp.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await api.put(`/users/${userId}`, {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        avatarUrl: form.avatarUrl.trim(),
        roleId: form.roleId,
      });

      if (form.newPassword) {
        await api.post("/auth/change-password", {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setSuccessMessage("Cập nhật hồ sơ thành công.");
    } catch {
      setErrorMessage("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
          <CardHeader className="pt-0 -mt-10 pb-4">
            <div className="flex flex-col items-start gap-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-white">
                {avatarSrc ? (
                  <AvatarImage
                    src={avatarSrc}
                    alt={form.fullName || form.username}
                  />
                ) : null}
                <AvatarFallback className="bg-emerald-700 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <CardTitle className="text-2xl font-bold text-stone-900 leading-tight tracking-tight">
                  {form.fullName ||
                    form.username ||
                    (isLoading ? "Đang tải..." : "Người dùng")}
                </CardTitle>
                <p className="mt-1 text-sm text-stone-600">
                  {form.email || "--"}
                </p>
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
                  disabled={isUploadingAvatar}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh đại diện"}
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
              {avatarError ? (
                <p className="text-xs font-medium text-red-600">
                  {avatarError}
                </p>
              ) : null}

              <p className="text-xs text-stone-500">Bạn có thể tải avatar.</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-stone-700">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-3">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  Vai trò: {form.role || "--"}
                </span>
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
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
              Tài khoản đang hoạt động
            </Badge>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-3 border-stone-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold text-stone-900">
                Thông tin cơ bản
              </CardTitle>
              <CardDescription className="text-stone-500"></CardDescription>
            </CardHeader>

            {errorMessage ? (
              <div className="mx-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}
            {successMessage ? (
              <div className="mx-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-stone-700">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-stone-700">
                  Username
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  disabled
                  className="h-11 bg-stone-50 border-stone-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="h-11 border-stone-300 focus-visible:ring-emerald-600"
                />
              </div>
            </CardContent>

            <CardHeader className="pb-0 pt-0">
              <CardTitle className="text-xl font-bold text-stone-900">
                Đổi mật khẩu
              </CardTitle>
              <CardDescription className="text-stone-500"></CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(
                [
                  ["currentPassword", "Mật khẩu hiện tại"],
                  ["newPassword", "Mật khẩu mới"],
                  ["confirmPassword", "Xác nhận mật khẩu"],
                ] as const
              ).map(([field, label]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-stone-700">
                    {label}
                  </Label>
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
                      {showPasswords[field] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
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
                  disabled={isSaving || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 w-1/2 sm:w-auto"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
