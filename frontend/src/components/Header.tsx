"use client";

<<<<<<< HEAD
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";
=======
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";
import TopHeaderWidget from "@/components/layout/TopHeaderWidget";

type MockSession = {
  fullName: string;
  identifier: string;
};

const AUTH_STORAGE_KEY = "mock-auth-session";
const AUTH_EVENT_NAME = "mock-auth-change";
const STICKY_MENU_THRESHOLD = 250;
>>>>>>> frontend-user-minh-hieu

const menuItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
<<<<<<< HEAD
  { href: "/dich-vu-hc", label: "Dịch vụ hành chính" },
=======
  { href: "/dich-vu", label: "Dịch vụ hành chính" },
>>>>>>> frontend-user-minh-hieu
  { href: "/thu-vien", label: "Thư viện" },
  { href: "/lien-he", label: "Liên hệ" },
];

<<<<<<< HEAD
export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
=======
const mobileDrawerItems = [
  { href: "/", label: "TRANG CHỦ" },
  { href: "/gioi-thieu", label: "GIỚI THIỆU" },
  { href: "/tin-tuc", label: "TIN TỨC" },
  {
    href: "/dich-vu",
    label: "DỊCH VỤ HÀNH CHÍNH",
    children: [
      { href: "/dich-vu/tra-cuu", label: "Tra cứu hồ sơ" },
      { href: "/dich-vu/nop-ho-so", label: "Nộp hồ sơ trực tuyến" },
      { href: "/dich-vu", label: "Biểu mẫu" },
    ],
  },
  { href: "/thu-vien", label: "THƯ VIỆN" },
  { href: "/lien-he", label: "LIÊN HỆ" },
];

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function readStoredSession(): MockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }
}

export default function Header() {
  const pathname = usePathname();
  const isAuxMenuRoute = pathname === "/" || pathname.startsWith("/dich-vu");

  const [session, setSession] = useState<MockSession | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [isAuxVisible, setIsAuxVisible] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [showDesktopUserMenu, setShowDesktopUserMenu] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setSession(readStoredSession());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener(AUTH_EVENT_NAME, syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(AUTH_EVENT_NAME, syncAuthState);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 150);
      setShowStickyMenu(currentScrollY > STICKY_MENU_THRESHOLD);
      setIsAuxVisible(!isAuxMenuRoute || currentScrollY < 220);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAuxMenuRoute]);

  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDrawer]);

  useEffect(() => {
    setShowDrawer(false);
    setExpandedAccordion(null);
    setShowDesktopUserMenu(false);
    setShowMobileUserMenu(false);
  }, [pathname]);

  const isLoggedIn = Boolean(session);
  const displayName = session?.fullName ?? "Nguyễn Văn A";
  const initials = getInitials(displayName);
>>>>>>> frontend-user-minh-hieu

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
<<<<<<< HEAD
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
=======

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    setSession(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatchAuthChange();
    setShowDesktopUserMenu(false);
    setShowMobileUserMenu(false);
    setShowDrawer(false);
    window.location.replace("/");
  };

  const renderUserMenu = (mobile = false) => {
    const isOpen = mobile ? showMobileUserMenu : showDesktopUserMenu;

    return (
      <div
        className="relative"
        onMouseEnter={mobile ? undefined : () => setShowDesktopUserMenu(true)}
        onMouseLeave={mobile ? undefined : () => setShowDesktopUserMenu(false)}
      >
        <button
          type="button"
          onClick={mobile ? () => setShowMobileUserMenu((prev) => !prev) : undefined}
          className={`flex items-center rounded-full border border-emerald-200 bg-white/95 text-slate-700 shadow-sm transition hover:border-emerald-300 ${
            mobile ? "h-10 w-10 justify-center" : "gap-3 px-2 py-1.5"
          }`}
        >
          <span
            className={`flex items-center justify-center rounded-full bg-emerald-700 font-semibold text-white ${
              mobile ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
            }`}
          >
            {initials}
          </span>
          {!mobile ? <span className="hidden text-sm font-medium xl:block">{displayName}</span> : null}
        </button>

        <div
          className={`absolute right-0 top-full z-[140] mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
            isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <Link
            href="/trang-ca-nhan"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
          >
            Tài khoản của tôi
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  };

  const renderPrimaryMenuBar = () => (
    <div className="w-full bg-emerald-700">
      <div className="relative z-50 mx-auto w-full max-w-[1200px] px-2 md:px-6">
        <div className="flex items-center justify-between">
          <nav className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) =>
              item.label === "Dịch vụ hành chính" ? (
                <div
                  key={item.href}
                  className="group relative z-50 after:absolute after:left-0 after:right-0 after:top-full after:h-2 after:content-['']"
                >
                  <Link
                    href="/dich-vu"
                    className={`flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${
                      isActiveRoute("/dich-vu") ? "bg-black/20" : ""
                    }`}
                  >
                    {item.label}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px] transition-transform group-hover:rotate-180"
                      fill="none"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <div className="pointer-events-none invisible absolute left-0 top-full z-[100] mt-1 min-w-[220px] rounded-md bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    <Link
                      href="/dich-vu"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1f7a5a]"
                    >
                      Danh sách thủ tục
                    </Link>
                    <Link
                      href="/dich-vu/nop-ho-so"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1f7a5a]"
                    >
                      Nộp hồ sơ trực tuyến
                    </Link>
                    <Link
                      href="/dich-vu/tra-cuu"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1f7a5a]"
                    >
                      Tra cứu trạng thái
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${
                    isActiveRoute(item.href) ? "bg-black/20" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 whitespace-nowrap rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
            <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="relative z-50 w-full bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />

        <div className="fixed left-0 right-0 top-0 z-[101] border-b border-emerald-900/10 bg-slate-50 lg:hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${bgImage.src})` }}
          />

          <div className="relative z-10 flex h-[76px] items-center justify-between gap-2 px-3">
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setShowDrawer(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <span className="material-symbols-outlined text-green-700">menu</span>
            </button>

            <Link href="/" aria-label="Trang chủ" className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={logoImage}
                  alt="Logo Phường Cao Lãnh"
                  className="h-full w-full object-cover drop-shadow-[0_4px_10px_rgba(15,118,110,0.18)]"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[10px] font-bold tracking-wide text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</p>
                <p className="truncate text-[14px] font-black text-emerald-700">PHƯỜNG CAO LÃNH</p>
                <p className="truncate text-[10px] text-slate-600">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-1">
              {isLoggedIn ? renderUserMenu(true) : null}
            </div>
          </div>

          <div
            className={`absolute left-0 top-[76px] w-full bg-white/95 px-4 shadow-inner backdrop-blur-sm transition-all duration-300 ease-in-out ${
              showSearchMobile ? "visible max-h-[60px] py-2" : "invisible max-h-0 overflow-hidden py-0"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full rounded-md border border-slate-300 py-2 pl-3 pr-10 text-sm outline-none focus:border-green-700"
              />
              <button aria-label="Tìm kiếm" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={`${showSearchMobile ? "h-[136px]" : "h-[76px]"} lg:hidden`} />

        {isAuxMenuRoute ? (
          <div className="border-b border-slate-200 bg-white lg:hidden">
            <div className="no-scrollbar mx-auto flex w-full items-center gap-4 overflow-x-auto px-4 py-2 text-sm">
              <Link href="/dich-vu/tra-cuu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                Tra cứu hồ sơ
              </Link>
              <span className="h-4 w-px shrink-0 bg-slate-300" />
              <Link href="/dich-vu/nop-ho-so" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                Nộp hồ sơ trực tuyến
              </Link>
              <span className="h-4 w-px shrink-0 bg-slate-300" />
              <Link href="/dich-vu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                Biểu mẫu
              </Link>
              <span className="h-4 w-px shrink-0 bg-slate-300" />
              <span className="whitespace-nowrap font-medium text-pink-600">Đường dây nóng: 1900 xxxx</span>
            </div>
          </div>
        ) : null}

        {pathname === "/" ? (
          <div className="border-b border-slate-200 bg-slate-50 lg:hidden">
            <div className="mx-auto flex w-full items-center overflow-hidden px-4 py-2">
              <span className="relative z-10 mr-4 shrink-0 rounded bg-pink-600 px-2 py-1 text-xs font-bold uppercase text-white">
                Thông báo nhanh
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="marquee flex items-center gap-6 text-sm text-slate-700">
                  <span className="whitespace-nowrap">Triển khai tiêm vắc xin đợt 3 cho trẻ em dưới 5 tuổi</span>
                  <span className="text-slate-300">•</span>
                  <span className="whitespace-nowrap">Lịch tiếp dân: Thứ 3 và Thứ 5 hàng tuần tại Trụ sở UBND</span>
                  <span className="text-slate-300">•</span>
                  <span className="whitespace-nowrap">Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2026</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="hidden lg:block">
          <div
            className={`relative transition-all duration-300 ${
              isScrolled
                ? "h-0 m-0 overflow-hidden border-none py-0 opacity-0"
                : "h-auto border-b border-emerald-900/10 opacity-100"
            }`}
          >
            <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full md:h-28 md:w-28">
                  <Image
                    src={logoImage}
                    alt="Logo Phường Cao Lãnh"
                    className="h-full w-full object-cover drop-shadow-[0_8px_20px_rgba(15,118,110,0.22)]"
                    priority
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold tracking-wider text-red-600 md:text-sm">CỔNG THÔNG TIN ĐIỆN TỬ</p>
                  <h1 className="text-xl font-black uppercase leading-tight text-emerald-700 md:text-3xl">PHƯỜNG CAO LÃNH</h1>
                  <p className="text-xs font-medium text-slate-600 md:text-sm">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
                </div>
              </div>

              <div className="hidden flex-col items-end gap-3 lg:flex">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="font-bold text-emerald-700">VN | EN</span>
                  <span className="h-4 w-px bg-slate-300" />
                  {isLoggedIn ? (
                    renderUserMenu()
                  ) : (
                    <Link href="/login" className="rounded-md bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-800">
                      Đăng nhập
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-[280px] rounded border border-slate-300 bg-white py-1.5 pl-3 pr-9 text-sm outline-none ring-emerald-600 focus:ring-1"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    type="text"
                  />
                  <button aria-label="Tìm kiếm" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700">
                    <Search className="h-[15px] w-[15px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {renderPrimaryMenuBar()}

          {isAuxMenuRoute ? (
            <div
              className={`border-b border-slate-200 bg-white transition-all duration-300 ease-in-out ${
                !isAuxVisible ? "max-h-0 overflow-hidden border-none opacity-0" : "max-h-24 opacity-100"
              }`}
            >
              <div className="no-scrollbar mx-auto flex w-full max-w-[1200px] items-center gap-5 overflow-x-auto px-4 py-2 text-sm md:px-6">
                <Link href="/dich-vu/tra-cuu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                  Tra cứu hồ sơ
                </Link>
                <span className="h-4 w-px shrink-0 bg-slate-300" />
                <Link href="/dich-vu/nop-ho-so" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                  Nộp hồ sơ trực tuyến
                </Link>
                <span className="h-4 w-px shrink-0 bg-slate-300" />
                <Link href="/dich-vu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
                  Biểu mẫu
                </Link>
                <span className="h-4 w-px shrink-0 bg-slate-300" />
                <span className="whitespace-nowrap font-medium text-pink-600">Đường dây nóng: 1900 xxxx</span>
              </div>
            </div>
          ) : null}

          {pathname === "/" ? (
            <div
              className={`border-b border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out ${
                isAuxVisible ? "max-h-16 py-2 opacity-100" : "max-h-0 overflow-hidden border-none py-0 opacity-0"
              }`}
            >
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
                    <span className="whitespace-nowrap">Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2026</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] bg-black/50 transition-opacity duration-300 lg:hidden ${
          showDrawer ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setShowDrawer(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[120] h-screen w-[80%] bg-emerald-700 p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          showDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!showDrawer}
      >
        <button
          type="button"
          onClick={() => setShowDrawer(false)}
          aria-label="Đóng menu"
          className="absolute right-4 top-4 text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
              <Image
                src={logoImage}
                alt="Logo Phường Cao Lãnh"
                className="h-full w-full object-cover drop-shadow-[0_4px_12px_rgba(255,255,255,0.18)]"
              />
            </div>
            <div className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
              <p className="text-xs font-bold tracking-wide text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</p>
              <p className="text-xl font-black text-emerald-700">PHƯỜNG CAO LÃNH</p>
              <p className="whitespace-nowrap text-[12px] leading-tight text-slate-600">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/20 bg-emerald-800 px-3">
            <span className="material-symbols-outlined text-white/80">search</span>
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-full bg-transparent py-3 text-white placeholder:text-white/70 outline-none"
            />
          </div>
        </div>

        <nav className="mt-8 h-[calc(100vh-250px)] overflow-y-auto">
          <ul className="flex flex-col gap-4">
            {mobileDrawerItems.map((item) =>
              item.children ? (
                <li key={item.href} className="border-b border-white/20 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={item.href}
                      onClick={() => setShowDrawer(false)}
                      className="block flex-1 text-lg font-medium text-white"
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion((prev) => (prev === item.href ? null : item.href))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
                      aria-label={`Mở menu ${item.label}`}
                    >
                    <span
                      className={`material-symbols-outlined text-white/70 transition-transform duration-300 ${
                        expandedAccordion === item.href ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      expand_more
                    </span>
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedAccordion === item.href ? "mt-3 max-h-40" : "max-h-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setShowDrawer(false)}
                        className="block py-1.5 pl-4 text-base text-white/90"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href} className="border-b border-white/20 pb-4">
                  <Link
                    href={item.href}
                    onClick={() => setShowDrawer(false)}
                    className={`block text-lg font-medium transition ${
                      isActiveRoute(item.href) ? "text-white" : "text-white/95"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}

            {!isLoggedIn ? (
              <li>
                <Link
                  href="/login"
                  onClick={() => setShowDrawer(false)}
                  className="block w-full rounded-lg bg-red-700 py-2.5 text-center font-semibold text-white transition duration-200 hover:bg-red-800"
                >
                  Đăng nhập
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </aside>

      <div
        className={`fixed left-0 top-0 z-[100] hidden w-full origin-top bg-white shadow-md transition-all duration-300 ease-in-out lg:block ${
          showStickyMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-full opacity-0"
        }`}
      >
        {renderPrimaryMenuBar()}
      </div>
    </>
>>>>>>> frontend-user-minh-hieu
  );
}
