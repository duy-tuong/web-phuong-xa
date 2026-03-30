import { House, type LucideIcon } from "lucide-react";

export type HeaderMenuItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export const headerMenuItems: HeaderMenuItem[] = [
  { href: "/", label: "Trang chủ", icon: House },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/dich-vu", label: "Dịch vụ hành chính" },
  { href: "/thu-vien", label: "Thư viện" },
  { href: "/lien-he", label: "Liên hệ" },
];

export const headerBreakingNews = [
  "Triển khai tiêm vắc xin đợt 3 cho trẻ em dưới 5 tuổi",
  "Lịch tiếp dân: Thứ 3 và Thứ 5 hằng tuần tại Trụ sở UBND",
  "Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2026",
];

