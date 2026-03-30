"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FeaturedNewsSection from "@/components/tin-tuc/FeaturedNewsSection";
import NewsArchiveSection from "@/components/tin-tuc/NewsArchiveSection";
import NewsFiltersSection from "@/components/tin-tuc/NewsFiltersSection";
import { getArticles, getCategories } from "@/services/articleService";
import type { Article } from "@/types/article";

type SortMode = "newest" | "oldest" | "popular" | "title";

const ALL_CATEGORY = "Tất cả";
const DEFAULT_PAGE_SIZE = 6;

function parseViews(views: string) {
  const digits = views.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function parseArticleDate(value: string) {
  const isoTimestamp = Date.parse(value);
  if (!Number.isNaN(isoTimestamp)) {
    return isoTimestamp;
  }

  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return 0;
  }

  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function sortArticles(articles: Article[], sortMode: SortMode) {
  if (sortMode === "popular") {
    return [...articles].sort((left, right) => parseViews(right.views) - parseViews(left.views));
  }

  if (sortMode === "oldest") {
    return [...articles].sort(
      (left, right) => parseArticleDate(left.publishedAt || left.date) - parseArticleDate(right.publishedAt || right.date),
    );
  }

  if (sortMode === "title") {
    return [...articles].sort((left, right) => left.title.localeCompare(right.title, "vi"));
  }

  return [...articles].sort(
    (left, right) => parseArticleDate(right.publishedAt || right.date) - parseArticleDate(left.publishedAt || left.date),
  );
}

function buildPagination(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export default function TinTucListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? ALL_CATEGORY);
  const [sortMode, setSortMode] = useState<SortMode>((searchParams.get("sort") as SortMode) || "newest");

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
    setSelectedCategory(searchParams.get("category") ?? ALL_CATEGORY);
    setSortMode((searchParams.get("sort") as SortMode) || "newest");
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        const [nextArticles, nextCategories] = await Promise.all([getArticles(), getCategories()]);

        if (!isMounted) {
          return;
        }

        setArticles(nextArticles);
        setCategories(nextCategories.length > 0 ? nextCategories : [ALL_CATEGORY]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const applyFilters = (overrides?: {
    keyword?: string;
    selectedCategory?: string;
    sortMode?: SortMode;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextKeyword = overrides?.keyword ?? keyword;
    const nextCategory = overrides?.selectedCategory ?? selectedCategory;
    const nextSortMode = overrides?.sortMode ?? sortMode;
    const trimmedKeyword = nextKeyword.trim();

    if (trimmedKeyword) {
      params.set("q", trimmedKeyword);
    } else {
      params.delete("q");
    }

    if (nextCategory && nextCategory !== ALL_CATEGORY) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    if (nextSortMode !== "newest") {
      params.set("sort", nextSortMode);
    } else {
      params.delete("sort");
    }

    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const filteredArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const nextArticles = articles.filter((article) => {
      const matchesCategory = selectedCategory === ALL_CATEGORY || !selectedCategory || article.category === selectedCategory;
      const haystack = [article.title, article.bodyLead, article.category, article.author, article.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      const matchesKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });

    return sortArticles(nextArticles, sortMode);
  }, [articles, keyword, selectedCategory, sortMode]);

  const featuredArticles = useMemo(
    () => filteredArticles.filter((article) => article.isFeatured === true),
    [filteredArticles],
  );

  const regularArticles = useMemo(
    () => filteredArticles.filter((article) => article.isFeatured !== true),
    [filteredArticles],
  );

  const pageSize = DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(regularArticles.length / pageSize));
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1;
  const pagedRegularArticles = regularArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginationPages = buildPagination(currentPage, totalPages);

  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(page));
    }

    router.push(nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname);
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">Đang tải dữ liệu tin tức...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <NewsFiltersSection
        categories={categories}
        keyword={keyword}
        selectedCategory={selectedCategory}
        resultCount={filteredArticles.length}
        sortMode={sortMode}
        onKeywordChange={setKeyword}
        onCategoryChange={(value) => {
          setSelectedCategory(value);
          applyFilters({ selectedCategory: value });
        }}
        onSortChange={(value) => {
          setSortMode(value);
          applyFilters({ sortMode: value });
        }}
        onSubmit={() => applyFilters()}
      />

      {filteredArticles.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <span className="material-symbols-outlined">article</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy bài viết phù hợp</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Thử đổi từ khóa hoặc bộ lọc danh mục để xem thêm bài viết được đồng bộ từ backend.
          </p>
        </section>
      ) : (
        <>
          {featuredArticles.length > 0 ? <FeaturedNewsSection articles={featuredArticles} /> : null}

          <NewsArchiveSection articles={pagedRegularArticles} />

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang trước
              </button>

              {paginationPages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={
                    page === currentPage
                      ? "rounded-full bg-[#1f7a5a] px-4 py-2 text-sm font-bold text-white"
                      : "rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f7a5a] hover:text-[#1f7a5a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
