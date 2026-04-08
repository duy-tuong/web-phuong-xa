//! trang tin tức, hiển thị danh sách bài viết được đồng bộ từ backend
"use client";
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FeaturedNewsSection from "@/components/tin-tuc/FeaturedNewsSection";
import NewsArchiveSection from "@/components/tin-tuc/NewsArchiveSection";
import NewsFiltersSection from "@/components/tin-tuc/NewsFiltersSection";
import { parseViews } from "@/lib/news";
import { buildCompactPagination } from "@/lib/pagination";
import {
  buildPathWithSearchParams,
  cloneSearchParams,
  parsePositivePageParam,
  setOptionalQueryParam,
  setPageQueryParam,
} from "@/lib/query-params";
//  import hàm getArticles để lấy danh sách bài viết từ backend, hiển thị trên trang tin tức
//  import hàm getCategories để lấy danh sách danh mục bài viết từ backend, hiển thị bộ lọc danh mục trên trang tin tức
import { getArticles, getCategories } from "@/services/articleService";
import type { Article } from "@/types/article";

type SortMode = "newest" | "oldest" | "popular" | "title";

const ALL_CATEGORY = "Tất cả";
const DEFAULT_PAGE_SIZE = 6;
// Logic tính toán ngày tháng để sắp xếp bài viết theo ngày xuất bản, hỗ trợ cả định dạng ISO và định dạng "dd/MM/yyyy" phổ biến ở Việt Nam.
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
// Logic sắp xếp mảng bài viết theo các tiêu chí khác nhau, được gọi sau khi đã lọc theo từ khóa và danh mục để đảm bảo thứ tự đúng với mong muốn của người dùng.
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
// Đồng bộ State với URL mỗi khi URL thay đổi (Back/Forward trình duyệt)
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
  // Lưu dữ liệu vào state để render bộ lọc và danh sách bài viết.
        setArticles(nextArticles);
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
// LƯU Ý 2: Ghi trạng thái lên thanh địa chỉ 
  const applyFilters = (overrides?: {
    keyword?: string;
    selectedCategory?: string;
    sortMode?: SortMode;
  }) => {
    const params = cloneSearchParams(searchParams);
    const nextKeyword = overrides?.keyword ?? keyword;
    const nextCategory = overrides?.selectedCategory ?? selectedCategory;
    const nextSortMode = overrides?.sortMode ?? sortMode;

    setOptionalQueryParam(params, "q", nextKeyword);
    setOptionalQueryParam(params, "category", nextCategory !== ALL_CATEGORY ? nextCategory : null);
    setOptionalQueryParam(params, "sort", nextSortMode !== "newest" ? nextSortMode : null);
    setPageQueryParam(params, 1);
  // LOGIC SÂU: Không gọi API ở đây! Chỉ thay đổi đường link (VD: /tin-tuc?q=abc). 
    // Việc này giúp user có thể copy link gửi bạn bè, bạn bè mở lên vẫn giữ nguyên trạng thái đang lọc.
    router.push(buildPathWithSearchParams(pathname, params));
  };
// Lọc bài viết theo từ khóa và danh mục ngay trên frontend, không cần gọi API lại.
  const filteredArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
// LOGIC SÂU: Lọc trực tiếp trên mảng 'articles' đã tải sẵn ở Client  
    // Dùng useMemo để máy tính 'nhớ' kết quả. Nếu user gõ tìm kiếm, nó lục ngay trong RAM thay vì gọi API chọc xuống Server
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
// Tách riêng tin nổi bật và tin thường để render theo hai khối khác nhau.
  const featuredArticles = useMemo(
    () => filteredArticles.filter((article) => article.isFeatured === true),
    [filteredArticles],
  );

  const regularArticles = useMemo(
    () => filteredArticles.filter((article) => article.isFeatured !== true),
    [filteredArticles],
  );
 // Tính phân trang và chỉ cắt ra số bài cần hiển thị ở trang hiện tại.
  const totalPages = Math.max(1, Math.ceil(regularArticles.length / DEFAULT_PAGE_SIZE));
  const requestedPage = parsePositivePageParam(searchParams.get("page"));
  const currentPage = Math.min(requestedPage, totalPages);
  const pagedRegularArticles = regularArticles.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE,
  );
  const paginationPages = buildCompactPagination(currentPage, totalPages);

  const goToPage = (page: number) => {
    const nextParams = cloneSearchParams(searchParams);
    setPageQueryParam(nextParams, page);
    router.push(buildPathWithSearchParams(pathname, nextParams));
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
//! Mảng bài viết đã được lọc và sắp xếp, giờ chỉ việc render ra giao diện. Nếu có tin nổi bật thì hiển thị ở khối riêng, phần còn lại hiển thị theo phân trang bên dưới.
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* Khối 1: thanh tìm kiếm và bộ lọc danh mục. */}
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
            
          </p>
        </section>
      ) : (
        <>
         {/* Khối 2: nếu có tin nổi bật thì hiển thị trước, phần còn lại đi theo phân trang. */}
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

