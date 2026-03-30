import Link from "next/link";

type LibraryPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

function buildPagination(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

function getPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export default function LibraryPagination({
  basePath,
  currentPage,
  totalPages,
}: LibraryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPagination(currentPage, totalPages);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang thư viện">
      <Link
        href={getPageHref(basePath, currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          currentPage === 1
            ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
            : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
        }`}
      >
        Trang trước
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageHref(basePath, page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-[#1f7a5a] text-white shadow-md"
              : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={getPageHref(basePath, currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          currentPage === totalPages
            ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
            : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
        }`}
      >
        Trang sau
      </Link>
    </nav>
  );
}
