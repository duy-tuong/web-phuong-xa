"use client";

type NewsFiltersSectionProps = {
  categories: string[];
  keyword: string;
  selectedCategory: string;
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
};

export default function NewsFiltersSection({
  categories,
  keyword,
  selectedCategory,
  onKeywordChange,
  onCategoryChange,
  onSubmit,
}: NewsFiltersSectionProps) {
  const displayCategories = categories.length > 0 ? categories : ["Tat ca"];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 sm:text-4xl">
          Tin Tuc &amp; Su Kien Dia Phuong
        </h1>
        <p className="max-w-3xl text-base font-normal leading-relaxed text-slate-600">
          Cap nhat nhung thong tin moi nhat ve chinh tri, kinh te, xa hoi, van hoa va cac thong bao quan trong tai Phuong Cao Lanh.
        </p>
      </div>

      <div className="flex w-full max-w-4xl flex-col gap-4 sm:flex-row">
        <div className="relative flex h-12 flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#1f7a5a]/50">
          <div className="grid h-full w-12 place-items-center border-r border-slate-200 bg-slate-50 text-slate-400">
            <span className="material-symbols-outlined align-middle text-[24px]">search</span>
          </div>
          <input
            className="peer h-full w-full border-none bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
            placeholder="Tim tin tuc, su kien, thong bao..."
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

        <div className="relative flex h-12 w-full items-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#1f7a5a]/50 sm:w-60">
          <span className="material-symbols-outlined ml-3 mr-2 text-slate-400">category</span>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-full w-full cursor-pointer appearance-none border-none bg-transparent pr-8 text-sm text-slate-700 outline-none"
          >
            {displayCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 align-middle text-slate-400">expand_more</span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="h-12 rounded-lg bg-[#1f7a5a] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
        >
          Tim kiem
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
