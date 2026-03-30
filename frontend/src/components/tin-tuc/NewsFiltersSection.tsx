"use client";

const ALL_CATEGORY = "Tất cả";

type SortMode = "newest" | "oldest" | "popular" | "title";

type NewsFiltersSectionProps = {
  categories: string[];
  keyword: string;
  selectedCategory: string;
  resultCount: number;
  sortMode: SortMode;
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortMode) => void;
  onSubmit: () => void;
};

export default function NewsFiltersSection({
  categories,
  keyword,
  selectedCategory,
  resultCount,
  sortMode,
  onKeywordChange,
  onCategoryChange,
  onSortChange,
  onSubmit,
}: NewsFiltersSectionProps) {
  const displayCategories = categories.length > 0 ? categories : [ALL_CATEGORY];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 sm:text-4xl">
          Tin Tức &amp; Sự Kiện Địa Phương
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-slate-600">
          Cập nhật những thông tin mới nhất về chính trị, kinh tế, xã hội, văn hóa và các thông báo quan trọng tại
          Phường Cao Lãnh.
        </p>
      </div>

      <div className="flex w-full max-w-4xl flex-col gap-4 sm:flex-row">
        <div className="relative flex h-12 flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#1f7a5a]/50">
          <div className="grid h-full w-12 place-items-center border-r border-slate-200 bg-slate-50 text-slate-400">
            <span className="material-symbols-outlined align-middle text-[24px]">search</span>
          </div>
          <input
            className="peer h-full w-full border-none bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
            placeholder="Tìm tin tức, sự kiện, thông báo..."
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="h-12 rounded-lg bg-[#1f7a5a] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {displayCategories.map((category) => {
          const isActive = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={
                isActive
                  ? "flex h-10 items-center justify-center gap-x-2 rounded-full bg-[#1f7a5a] px-6 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                  : "flex h-10 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <div className="relative">
          <select
            value={sortMode}
            onChange={(event) => onSortChange(event.target.value as SortMode)}
            className="h-10 min-w-[180px] appearance-none rounded-full border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-[#1f7a5a] focus:border-[#1f7a5a]"
          >
            <option value="newest">Gần đây nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="popular">Xem nhiều</option>
            <option value="title">Tiêu đề A-Z</option>
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            expand_more
          </span>
        </div>

        <p className="ml-auto text-sm text-slate-500">
          Đang hiển thị <span className="font-semibold text-slate-800">{resultCount}</span> bài viết
        </p>
      </div>
    </section>
  );
}
