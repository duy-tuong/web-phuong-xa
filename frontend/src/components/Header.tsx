"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";
import HeaderAuthBlock from "@/components/layout/HeaderAuthBlock";
import HeaderBrand from "@/components/layout/HeaderBrand";
import HeaderNav from "@/components/layout/HeaderNav";
import HeaderSearchForm from "@/components/layout/HeaderSearchForm";
import { headerBreakingNews } from "@/components/layout/header-data";
import TopHeaderWidget from "@/components/layout/TopHeaderWidget";
import { buildPathWithSearchParams, cloneSearchParams, setOptionalQueryParam } from "@/lib/query-params";
import { normalizeVietnamese } from "@/lib/normalize";
import {
  AUTH_EVENT_NAME,
  clearUserSession,
  getInitials,
  readUserSession,
  type UserSession,
} from "@/lib/user-session";
import { getArticles } from "@/services/articleService";
import { fetchLibraryPhotos } from "@/services/mediaLibraryService";
import { getProcedures } from "@/services/serviceService";

const STICKY_MENU_THRESHOLD = 250;

function findBestMatch<T>(items: T[], query: string, getText: (item: T) => string) {
  const normalizedQuery = normalizeVietnamese(query.trim());

  const exact = items.find((item) => normalizeVietnamese(getText(item)) === normalizedQuery);
  if (exact) {
    return exact;
  }

  const startsWith = items.find((item) => normalizeVietnamese(getText(item)).startsWith(normalizedQuery));
  if (startsWith) {
    return startsWith;
  }

  return items.find((item) => normalizeVietnamese(getText(item)).includes(normalizedQuery)) ?? null;
}

function buildSearchRoute(pathname: string, query: string) {
  const params = cloneSearchParams("");
  setOptionalQueryParam(params, "q", query);
  return buildPathWithSearchParams(pathname, params);
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isHomePage = pathname === "/";
  const isAuxMenuRoute = pathname === "/" || pathname.startsWith("/dich-vu");
  const [session, setSession] = useState<UserSession | null>(null);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) {
        return;
      }

      if (!userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveRoute = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const isLoggedIn = Boolean(session);
  const initials = getInitials(session?.fullName ?? "Người dùng");
  const initialSearchQuery =
    pathname.startsWith("/tin-tuc") || pathname.startsWith("/dich-vu") ? searchParams.get("q") ?? "" : "";

  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    setShowUserMenu(false);
    setShowDrawer(false);
    window.location.replace("/");
  };

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/tin-tuc");
      return;
    }

    const [articlesResult, servicesResult, photosResult] = await Promise.allSettled([
      getArticles(),
      getProcedures(),
      fetchLibraryPhotos(24),
    ]);

    const articles = articlesResult.status === "fulfilled" ? articlesResult.value : [];
    const services = servicesResult.status === "fulfilled" ? servicesResult.value : [];
    const photos = photosResult.status === "fulfilled" ? photosResult.value : [];

    const exactArticle = findBestMatch(articles, trimmedQuery, (item) => item.title);
    if (exactArticle) {
      router.push(`/tin-tuc/${exactArticle.slug}`);
      return;
    }

    const exactService = findBestMatch(services, trimmedQuery, (item) => item.title);
    if (exactService) {
      router.push(`/dich-vu/chi-tiet-ho-so/${exactService.slug}`);
      return;
    }

    const photoMatch = findBestMatch(photos, trimmedQuery, (item) => item.title);
    if (photoMatch) {
      router.push("/thu-vien/hinh-anh");
      return;
    }

    const normalizedQuery = normalizeVietnamese(trimmedQuery);

    const articleResults = articles.filter((item) =>
      normalizeVietnamese([item.title, item.bodyLead, item.category, item.author, item.tags.join(" ")].join(" ")).includes(normalizedQuery),
    );
    if (articleResults.length > 0) {
      router.push(buildSearchRoute("/tin-tuc", trimmedQuery));
      return;
    }

    const serviceResults = services.filter((item) =>
      normalizeVietnamese([item.title, item.processingTime, item.fee, item.requirements.join(" ")].join(" ")).includes(normalizedQuery),
    );
    if (serviceResults.length > 0) {
      router.push(buildSearchRoute("/dich-vu", trimmedQuery));
      return;
    }

    router.push(buildSearchRoute("/tin-tuc", trimmedQuery));
  };

  const quickLinks = (
    <>
      <Link href="/dich-vu/tra-cuu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Tra cứu hồ sơ
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <Link href="/dich-vu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Nộp hồ sơ trực tuyến
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <Link href="/dich-vu" className="whitespace-nowrap font-medium text-slate-700 hover:text-emerald-700">
        Biểu mẫu
      </Link>
      <span className="h-4 w-px shrink-0 bg-slate-300" />
      <span className="whitespace-nowrap font-medium text-pink-600">Đường dây nóng: 1900 1234</span>
    </>
  );

  const newsTicker = (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1200px] items-center overflow-hidden px-4 py-2 md:px-6">
        <span className="relative z-10 mr-4 shrink-0 rounded bg-pink-600 px-2 py-1 text-xs font-bold uppercase text-white">
          Thông báo nhanh
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee flex items-center gap-6 text-sm text-slate-700">
            {headerBreakingNews.map((item) => (
              <span key={item} className="whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="relative z-50 w-full bg-white">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${bgImage.src})` }} />

        <div className="fixed left-0 right-0 top-0 z-[101] border-b border-emerald-900/10 bg-slate-50 lg:hidden">
          <div className="relative z-10 flex h-[76px] items-center justify-between gap-2 px-3">
            <button type="button" aria-label="Mở menu" onClick={() => setShowDrawer(true)} className="flex h-10 w-10 items-center justify-center">
              <span className="material-symbols-outlined text-green-700">menu</span>
            </button>

            <HeaderBrand compact logoImage={logoImage} />
          </div>
        </div>

        <div className="h-[76px] lg:hidden" />

        {isAuxMenuRoute ? (
          <div className="border-b border-slate-200 bg-white lg:hidden">
            <div className="no-scrollbar mx-auto flex w-full items-center gap-4 overflow-x-auto px-4 py-2 text-sm">{quickLinks}</div>
          </div>
        ) : null}

        {isHomePage ? <div className="lg:hidden">{newsTicker}</div> : null}

        <div className="hidden lg:block">
          <div className="relative border-b border-emerald-900/10">
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6">
              <HeaderBrand logoImage={logoImage} />

              <div className="hidden flex-col items-end gap-3 lg:flex">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="font-bold text-emerald-700">VN | EN</span>
                  <span className="h-4 w-px bg-slate-300" />
                  <HeaderAuthBlock
                    initials={initials}
                    session={session}
                    showUserMenu={showUserMenu}
                    userMenuRef={userMenuRef}
                    onToggleUserMenu={() => setShowUserMenu((prev) => !prev)}
                    onCloseMenus={() => setShowUserMenu(false)}
                    onLogout={handleLogout}
                  />
                </div>

                <HeaderSearchForm
                  key={`${pathname}:${searchParams.toString()}`}
                  initialValue={initialSearchQuery}
                  onSubmit={(value) => {
                    void handleSearch(value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full bg-emerald-700">
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-2 md:px-6">
              <HeaderNav isActiveRoute={isActiveRoute} />
              <div className="hidden items-center gap-2 whitespace-nowrap rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
                <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" />
              </div>
            </div>
          </div>

          {isAuxMenuRoute ? (
            <div className="border-b border-slate-200 bg-white">
              <div className="no-scrollbar mx-auto flex w-full max-w-[1200px] items-center gap-5 overflow-x-auto px-4 py-2 text-sm md:px-6">
                {quickLinks}
              </div>
            </div>
          ) : null}

          {isHomePage ? newsTicker : null}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] bg-black/50 transition-opacity duration-300 lg:hidden ${showDrawer ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setShowDrawer(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[120] h-screen w-[80%] bg-emerald-700 p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${showDrawer ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!showDrawer}
      >
        <button type="button" onClick={() => setShowDrawer(false)} aria-label="Dong menu" className="absolute right-4 top-4 text-white">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <Image src={logoImage} alt="Logo Phuong Cao Lanh" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
            <p className="text-xs font-bold tracking-wide text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</p>
            <p className="text-xl font-black text-emerald-700">PHƯỜNG CAO LÃNH</p>
            <p className="whitespace-nowrap text-[12px] leading-tight text-slate-600">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
          </div>
        </div>

        <HeaderNav isActiveRoute={isActiveRoute} mobile onNavigate={() => setShowDrawer(false)} />

        {!isLoggedIn ? (
          <Link href="/login" onClick={() => setShowDrawer(false)} className="mt-6 block rounded-lg bg-red-700 py-2.5 text-center font-semibold text-white">
            Đăng nhập
          </Link>
        ) : (
          <button type="button" onClick={handleLogout} className="mt-6 rounded-lg bg-white py-2.5 text-center font-semibold text-emerald-800">
            Dang xuat
          </button>
        )}
      </aside>

      <div
        className={`fixed left-0 top-0 z-[100] hidden w-full origin-top bg-white shadow-md transition-all duration-300 ease-in-out lg:block ${showStickyMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-full opacity-0"}`}
      >
        <div className="w-full bg-emerald-700">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-2 md:px-6">
            <HeaderNav isActiveRoute={isActiveRoute} />
            <div className="hidden items-center gap-2 whitespace-nowrap rounded bg-black/10 px-4 py-2 text-sm font-medium text-white lg:flex">
              <TopHeaderWidget textColor="text-white" iconColor="text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

