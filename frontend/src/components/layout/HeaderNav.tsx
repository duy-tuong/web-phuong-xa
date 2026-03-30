import Link from "next/link";

import {
  headerMenuItems,
  type HeaderMenuItem,
} from "@/components/layout/header-data";

type HeaderNavProps = {
  isActiveRoute: (href: string) => boolean;
  items?: HeaderMenuItem[];
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function HeaderNav({
  isActiveRoute,
  items = headerMenuItems,
  mobile = false,
  onNavigate,
}: HeaderNavProps) {
  if (mobile) {
    return (
      <nav className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`inline-flex items-center gap-2 border-b border-white/20 pb-4 text-lg font-medium ${isActiveRoute(item.href) ? "text-white" : "text-white/95"}`}
          >
            {item.icon ? <item.icon className="h-5 w-5" strokeWidth={2.4} /> : null}
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-black/20 md:px-5 md:py-3.5 md:text-[15px] ${isActiveRoute(item.href) ? "bg-black/20" : ""}`}
        >
          {item.icon ? <item.icon className="h-4 w-4" strokeWidth={2.4} /> : null}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
