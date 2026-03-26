"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  Landmark,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { adminNavItems } from "@/components/admin/nav-items";
import { cn } from "@/lib/utils";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatarSrc, setAvatarSrc] = useState("");
  const [mobileLogoUnavailable, setMobileLogoUnavailable] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const logoPath = "/logo-admin.png";

  const activeNavItem = adminNavItems.find(
    (item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  const isProfileRoute = pathname.startsWith("/admin/profile");

  const currentSectionLabel =
    pathname === "/admin"
      ? "Dashboard"
      : isProfileRoute
        ? "Hồ sơ cá nhân"
        : activeNavItem?.label || "Dashboard";

  useEffect(() => {
    const syncAvatar = () => {
      setAvatarSrc(localStorage.getItem("admin_avatar") || "");
    };

    syncAvatar();
    window.addEventListener("storage", syncAvatar);
    window.addEventListener("admin-avatar-updated", syncAvatar as EventListener);

    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener("admin-avatar-updated", syncAvatar as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_display_name");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_avatar");
    document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Lax";
    router.replace("/login?redirect=/admin");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[hsl(36,16%,84%)] bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-3 sm:px-5 lg:px-6 gap-2">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-stone-600 hover:text-emerald-700"
                aria-label="Mở menu quản trị"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
              <SheetHeader className="border-b border-[hsl(156,24%,18%)] px-4 py-4 text-left bg-[linear-gradient(145deg,hsl(156,38%,22%),hsl(152,34%,26%))]">
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                      {mobileLogoUnavailable ? (
                        <div className="w-11 h-11 rounded-xl bg-[hsl(156,32%,18%)] flex items-center justify-center">
                          <Landmark className="w-6 h-6 text-[hsl(40,33%,88%)]" />
                        </div>
                      ) : (
                        <NextImage
                          src={logoPath}
                          alt="Logo Phường Cao Lãnh"
                          width={44}
                          height={44}
                          className="h-full w-full object-contain"
                          priority
                          onError={() => setMobileLogoUnavailable(true)}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold leading-tight tracking-[0.01em] bg-[linear-gradient(180deg,hsl(41,72%,93%),hsl(36,62%,80%))] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.18)] truncate">
                        Phường Cao Lãnh
                      </p>
                      <p className="text-[10px] text-[hsl(40,30%,72%)] truncate mt-0.5">
                        Hệ thống quản trị nội dung
                      </p>
                    </div>
                  </div>
                </SheetTitle>
                <p className="text-xs text-[hsl(40,30%,78%)] mt-1">Đang mở: {currentSectionLabel}</p>
              </SheetHeader>

              <nav className="px-3 py-3 space-y-1 overflow-y-auto">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[hsl(154,24%,23%)] text-[hsl(40,68%,78%)] border-l-4 border-[hsl(34,60%,50%)]"
                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", isActive ? "text-[hsl(34,72%,50%)]" : "text-current")} />
                        <span>{item.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="min-w-0 max-w-[52vw] sm:max-w-[40vw] lg:max-w-[46vw]">
            <span
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-md border border-[hsl(156,20%,84%)] bg-[linear-gradient(180deg,hsl(156,22%,96%),hsl(156,18%,93%))] px-2.5 py-1.5 leading-[1.2] text-[hsl(156,34%,27%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                isProfileRoute
                  ? "text-[17px] sm:text-[19px] lg:text-[22px] font-bold"
                  : "text-[15px] sm:text-[16px] lg:text-[18px] font-semibold"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(156,44%,35%)] flex-shrink-0" />
              <span className="truncate">{currentSectionLabel}</span>
            </span>
          </h1>
        </div>

        {/* Right section */}
        <div className="relative flex items-center gap-1.5 sm:gap-2.5">
          {/* Search */}
          <div className="hidden md:block relative">
            {!showSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => setShowSearch(true)}
                aria-label="Mở tìm kiếm"
              >
                <Search className="w-[18px] h-[18px]" />
              </Button>
            )}
            {showSearch && (
              <div className="absolute right-0 top-1/2 z-40 w-[280px] -translate-y-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    autoFocus
                    placeholder="Tìm kiếm..."
                    className="pl-9 pr-10 bg-white border-stone-200 h-9 text-sm shadow-sm"
                    onBlur={() => setShowSearch(false)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label="Đóng tìm kiếm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 hidden sm:inline-flex"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(34,72%,50%)] rounded-full" />
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <Avatar className="w-9 h-9 border border-stone-200">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt="Admin avatar" />}
                  <AvatarFallback className="bg-emerald-700 text-white text-xs font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-stone-800">Admin</p>
                  <p className="text-[11px] text-stone-500">Quản trị viên</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2 w-full"
                >
                  <User className="w-4 h-4" />
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
