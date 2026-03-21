"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";

const menuItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/dich-vu-hc", label: "Dịch vụ hành chính" },
  { href: "/thu-vien", label: "Thư viện" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="relative z-50 w-full bg-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      />

      <div className="relative border-b border-emerald-900/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full shadow-lg md:h-28 md:w-28">
              <Image src={logoImage} alt="Logo Phường Cao Lãnh" className="h-full w-full object-cover" priority />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold tracking-wider text-red-600 md:text-sm">CỔNG THÔNG TIN ĐIỆN TỬ</p>
              <h1 className="text-xl font-black uppercase leading-tight text-emerald-700 md:text-3xl">PHƯỜNG CAO LÃNH</h1>
              <p className="text-xs font-medium text-slate-600 md:text-sm">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
            </div>
          </div>

          <div className="hidden flex-col items-end gap-3 lg:flex">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <span>Thứ Hai, 23/10/2023</span>
              <span className="h-4 w-px bg-slate-300" />
              <span className="text-emerald-700">VN | EN</span>
              <span className="h-4 w-px bg-slate-300" />
              <Link href="/login" className="rounded-md bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-800">
                Đăng nhập
              </Link>
            </div>
            <input
              className="w-[280px] rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none ring-emerald-600 focus:ring-1"
              placeholder="Nhập từ khóa tìm kiếm..."
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 w-full bg-emerald-700">
        <div className="mx-auto w-full max-w-[1200px] px-2 md:px-6">
          <div className="flex items-center justify-between">
            <nav className="no-scrollbar hidden items-center gap-1 overflow-x-auto md:flex">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${isActiveRoute(item.href) ? "bg-black/20" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              aria-label="Mở menu điều hướng"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-black/20 md:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1.5">
                <span className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>

            <div className="hidden rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
              Cao Lãnh 25-32°C
            </div>
          </div>

          <div className={`${isMobileMenuOpen ? "max-h-[360px] py-2" : "max-h-0"} overflow-hidden transition-all duration-300 md:hidden`}>
            <nav className="flex flex-col rounded-md bg-emerald-800/80 p-2 backdrop-blur">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded px-3 py-2 text-sm font-semibold text-white transition ${isActiveRoute(item.href) ? "bg-white text-emerald-800" : "hover:bg-black/20"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="no-scrollbar mx-auto flex w-full max-w-[1200px] items-center gap-5 overflow-x-auto px-4 py-2 text-sm md:px-6">
          <Link href="/dich-vu-hc/tra-cuu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
            Tra cứu hồ sơ
          </Link>
          <span className="h-4 w-px shrink-0 bg-slate-300" />
          <Link href="/dich-vu-hc/nop-ho-so" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
            Nộp hồ sơ trực tuyến
          </Link>
          <span className="h-4 w-px shrink-0 bg-slate-300" />
          <Link href="/dich-vu-hc" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
            Biểu mẫu
          </Link>
          <span className="h-4 w-px shrink-0 bg-slate-300" />
          <span className="whitespace-nowrap font-medium text-pink-600">Đường dây nóng: 1900 xxxx</span>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-slate-50 py-2">
        <div className="mx-auto flex w-full max-w-[1200px] items-center overflow-hidden px-4 md:px-6">
          <span className="relative z-10 mr-4 shrink-0 rounded bg-pink-600 px-2 py-1 text-xs font-bold uppercase text-white">
            Thông báo nhanh
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="marquee flex items-center gap-6 text-sm text-slate-700">
              <span className="whitespace-nowrap">Triển khai tiêm vắc xin đợt 3 cho trẻ em dưới 5 tuổi</span>
              <span className="text-slate-300">•</span>
              <span className="whitespace-nowrap">Lịch tiếp dân: Thứ 3 và Thứ 5 hàng tuần tại Trụ sở UBND</span>
              <span className="text-slate-300">•</span>
              <span className="whitespace-nowrap">Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2023</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
