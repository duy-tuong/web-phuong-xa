"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FeaturedNewsSection from "@/components/tin-tuc/FeaturedNewsSection";
import NewsArchiveSection from "@/components/tin-tuc/NewsArchiveSection";
import NewsFiltersSection from "@/components/tin-tuc/NewsFiltersSection";
import { getArticles, getCategories } from "@/services/articleService";
import type { Article } from "@/types/article";

type SortMode = "newest" | "popular" | "title";

function parseViews(views: string) {
  const digits = views.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function sortArticles(articles: Article[], sortMode: SortMode) {
  if (sortMode === "popular") {
    return [...articles].sort((left, right) => parseViews(right.views) - parseViews(left.views));
  }

  if (sortMode === "title") {
    return [...articles].sort((left, right) => left.title.localeCompare(right.title, "vi"));
  }

  return [...articles];
}

export default function TinTucListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tat ca"]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "Tat ca");
  const [sortMode, setSortMode] = useState<SortMode>((searchParams.get("sort") as SortMode) || "newest");

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
    setSelectedCategory(searchParams.get("category") ?? "Tat ca");
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
        setCategories(nextCategories);
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

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      params.set("q", trimmedKeyword);
    } else {
      params.delete("q");
    }

    if (selectedCategory && selectedCategory !== "Tat ca") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (sortMode !== "newest") {
      params.set("sort", sortMode);
    } else {
      params.delete("sort");
    }

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const filteredArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const nextArticles = articles.filter((article) => {
      const matchesCategory = selectedCategory === "Tat ca" || !selectedCategory || article.category === selectedCategory;
      const haystack = [article.title, article.bodyLead, article.category, article.author, article.tags.join(" ")].join(" ").toLowerCase();
      const matchesKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });

    return sortArticles(nextArticles, sortMode);
  }, [articles, keyword, selectedCategory, sortMode]);

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-600">Dang tai du lieu tin tuc...</p>
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
        onKeywordChange={setKeyword}
        onCategoryChange={setSelectedCategory}
        onSubmit={applyFilters}
      />

      {filteredArticles.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <span className="material-symbols-outlined">article</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Khong tim thay bai viet phu hop</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Thu doi tu khoa hoac bo loc danh muc de xem them bai viet duoc dong bo tu backend.
          </p>
        </section>
      ) : (
        <>
          <FeaturedNewsSection articles={filteredArticles} sortMode={sortMode} onSortChange={setSortMode} />
          <NewsArchiveSection articles={filteredArticles} />
        </>
      )}
    </main>
  );
}
