"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, Search } from "lucide-react";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";
import TopHeaderWidget from "@/components/layout/TopHeaderWidget";
import {
  AUTH_EVENT_NAME,
  clearUserSession,
  getInitials,
  readUserSession,
  type UserSession,
} from "@/lib/user-session";

const STICKY_MENU_THRESHOLD = 250;

const menuItems = [
  { href: "/", label: "Trang chu", icon: House },
  { href: "/gioi-thieu", label: "Gioi thieu" },
  { href: "/tin-tuc", label: "Tin tuc" },
  { href: "/dich-vu", label: "Dich vu hanh chinh" },
  { href: "/thu-vien", label: "Thu vien" },
  { href: "/lien-he", label: "Lien he" },
];

const breakingNews = [
  "Trien khai tiem vac xin dot 3 cho tre em duoi 5 tuoi",
  "Lich tiep dan: Thu 3 va Thu 5 hang tuan tai Tru so UBND",
  "Thong bao ho tro vay von san xuat kinh doanh nam 2026",
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAuxMenuRoute = pathname === "/" || pathname.startsWith("/dich-vu");
  const [session, setSession] = useState<UserSession | null>(null);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncAuthState = () => setSession(readUserSession());
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
      setShowStickyMenu(window.scrollY > STICKY_MENU_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDrawer]);

  const isActiveRoute = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const isLoggedIn = Boolean(session);
  const initials = getInitials(session?.fullName ?? "Nguoi dung");

  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    setShowUserMenu(false);
    setShowDrawer(false);
    window.location.replace("/");
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      router.push("/tin-tuc");
      return;
    }

    router.push(`/tin-tuc?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const quickLinks = (
    <>
      <Link href="/dich-vu/tra-cuu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Tra cuu ho so
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <Link href="/dich-vu/nop-ho-so" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Nop ho so truc tuyen
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <Link href="/dich-vu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Bieu mau
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <span className="whitespace-nowrap font-medium text-pink-600">Duong day nong: 1900 xxxx</span>
    </>
  );

  const newsTicker = (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1200px] items-center overflow-hidden px-4 py-2 md:px-6">
        <span className="relative z-10 mr-4 shrink-0 rounded bg-pink-600 px-2 py-1 text-xs font-bold uppercase text-white">
          Thong bao nhanh
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee flex items-center gap-6 text-sm text-slate-700">
            {breakingNews.map((item) => (
              <span key={item} className="whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const authBlock = isLoggedIn ? (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowUserMenu((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white/95 px-2 py-1.5 text-slate-700 shadow-sm transition hover:border-emerald-300"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-sm font-medium xl:block">{session?.fullName}</span>
      </button>

      <div
        className={`absolute right-0 top-full z-[140] mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
          showUserMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <Link
          href="/trang-ca-nhan"
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
        >
          Tai khoan cua toi
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          Dang xuat
        </button>
      </div>
    </div>
  ) : (
    <Link href="/login" className="rounded-md bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-800">
      Dang nhap
    </Link>
  );

  return (
    <>
      <header className="relative z-50 w-full bg-white">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${bgImage.src})` }} />
        <div className="fixed left-0 right-0 top-0 z-[101] border-b border-emerald-900/10 bg-slate-50 lg:hidden">
          <div className="relative z-10 flex h-[76px] items-center justify-between gap-2 px-3">
            <button type="button" aria-label="Mo menu" onClick={() => setShowDrawer(true)} className="flex h-10 w-10 items-center justify-center">
              <span className="material-symbols-outlined text-green-700">menu</span>
            </button>

            <Link href="/" aria-label="Trang chu" className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                <Image src={logoImage} alt="Logo Phuong Cao Lanh" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[10px] font-bold tracking-wide text-red-600">CONG THONG TIN DIEN TU</p>
                <p className="truncate text-[14px] font-black text-emerald-700">PHUONG CAO LANH</p>
                <p className="truncate text-[10px] text-slate-600">Thanh pho Cao Lanh - Tinh Dong Thap</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="fixed left-0 right-0 top-[76px] z-[100] border-b border-emerald-900/10 bg-emerald-700 lg:hidden">
          <div className="relative z-10 flex items-center justify-center px-3 py-2">
            <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" showDate={false} />
          </div>
        </div>

        <div className="h-[116px] lg:hidden" />
        {isAuxMenuRoute ? <div className="border-b border-slate-200 bg-white lg:hidden"><div className="no-scrollbar mx-auto flex w-full items-center gap-4 overflow-x-auto px-4 py-2 text-sm">{quickLinks}</div></div> : null}

        <div className="hidden lg:block">
          <div className="relative border-b border-emerald-900/10">
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full md:h-28 md:w-28">
                  <Image src={logoImage} alt="Logo Phuong Cao Lanh" className="h-full w-full object-cover" priority />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold tracking-wider text-red-600 md:text-sm">CONG THONG TIN DIEN TU</p>
                  <h1 className="text-xl font-black uppercase leading-tight text-emerald-700 md:text-3xl">PHUONG CAO LANH</h1>
                  <p className="text-xs font-medium text-slate-600 md:text-sm">Thanh pho Cao Lanh - Tinh Dong Thap</p>
                </div>
              </div>

              <div className="hidden flex-col items-end gap-3 lg:flex">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="font-bold text-emerald-700">VN | EN</span>
                  <span className="h-4 w-px bg-slate-300" />
                  {authBlock}
                </div>
                <div className="relative">
                  <input
                    className="w-[280px] rounded border border-slate-300 bg-white py-1.5 pl-3 pr-9 text-sm outline-none ring-emerald-600 focus:ring-1"
                    placeholder="Nhap tu khoa tim kiem..."
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <button type="button" onClick={handleSearch} aria-label="Tim kiem" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700">
                    <Search className="h-[15px] w-[15px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-emerald-700">
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-2 md:px-6">
              <nav className="hidden items-center gap-1 md:flex">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${isActiveRoute(item.href) ? "bg-black/20" : ""}`}>
                    {item.icon ? <item.icon className="h-4 w-4" strokeWidth={2.4} /> : null}
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden items-center gap-2 whitespace-nowrap rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
                <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" />
              </div>
            </div>
          </div>

          {isAuxMenuRoute ? <div className="border-b border-slate-200 bg-white"><div className="no-scrollbar mx-auto flex w-full max-w-[1200px] items-center gap-5 overflow-x-auto px-4 py-2 text-sm md:px-6">{quickLinks}</div></div> : null}
          {isHomePage ? newsTicker : null}
        </div>
      </header>

      <div className={`fixed inset-0 z-[110] bg-black/50 transition-opacity duration-300 lg:hidden ${showDrawer ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setShowDrawer(false)} />

      <aside className={`fixed left-0 top-0 z-[120] h-screen w-[80%] bg-emerald-700 p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${showDrawer ? "translate-x-0" : "-translate-x-full"}`} aria-hidden={!showDrawer}>
        <button type="button" onClick={() => setShowDrawer(false)} aria-label="Dong menu" className="absolute right-4 top-4 text-white">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <Image src={logoImage} alt="Logo Phuong Cao Lanh" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
            <p className="text-xs font-bold tracking-wide text-red-600">CONG THONG TIN DIEN TU</p>
            <p className="text-xl font-black text-emerald-700">PHUONG CAO LANH</p>
            <p className="whitespace-nowrap text-[12px] leading-tight text-slate-600">Thanh pho Cao Lanh - Tinh Dong Thap</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setShowDrawer(false)} className={`inline-flex items-center gap-2 border-b border-white/20 pb-4 text-lg font-medium ${isActiveRoute(item.href) ? "text-white" : "text-white/95"}`}>
              {item.icon ? <item.icon className="h-5 w-5" strokeWidth={2.4} /> : null}
              {item.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Link href="/login" onClick={() => setShowDrawer(false)} className="block rounded-lg bg-red-700 py-2.5 text-center font-semibold text-white">
              Dang nhap
            </Link>
          ) : (
            <button type="button" onClick={handleLogout} className="rounded-lg bg-white py-2.5 text-center font-semibold text-emerald-800">
              Dang xuat
            </button>
          )}
        </nav>
      </aside>

      <div className={`fixed left-0 top-0 z-[100] hidden w-full origin-top bg-white shadow-md transition-all duration-300 ease-in-out lg:block ${showStickyMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-full opacity-0"}`}>
        <div className="w-full bg-emerald-700">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-2 md:px-6">
            <nav className="hidden items-center gap-1 md:flex">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${isActiveRoute(item.href) ? "bg-black/20" : ""}`}>
                  {item.icon ? <item.icon className="h-4 w-4" strokeWidth={2.4} /> : null}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 whitespace-nowrap rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
              <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
