import {
  ClipboardList,
  FileText,
  FolderTree,
  Image as MediaIcon,
  Landmark,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ScrollText,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
  { label: "Người dùng", href: "/admin/users", icon: Users },
  { label: "Vai trò", href: "/admin/roles", icon: Shield },
  { label: "Bài viết", href: "/admin/articles", icon: FileText },
  { label: "Danh mục", href: "/admin/categories", icon: FolderTree },
  { label: "Phương tiện", href: "/admin/media", icon: MediaIcon },
  { label: "Bình luận", href: "/admin/comments", icon: MessageSquare },
  { label: "Dịch vụ", href: "/admin/services", icon: Landmark },
  { label: "Hồ sơ", href: "/admin/applications", icon: ClipboardList },
  { label: "Liên hệ", href: "/admin/contacts", icon: Mail },
  { label: "Nhật ký", href: "/admin/logs", icon: ScrollText },
];
