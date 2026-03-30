"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FIELD_OPTIONS = [
  { value: "", label: "Tất cả lĩnh vực" },
  { value: "ho-tich", label: "Hộ tịch" },
  { value: "dat-dai", label: "Đất đai" },
  { value: "kinh-doanh", label: "Kinh doanh" },
  { value: "hanh-chinh-cong", label: "Hành chính công" },
];

export default function ServiceSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [field, setField] = useState(searchParams.get("field") ?? "");

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
    setField(searchParams.get("field") ?? "");
  }, [searchParams]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      params.set("q", trimmedKeyword);
    } else {
      params.delete("q");
    }

    if (field) {
      params.set("field", field);
    } else {
      params.delete("field");
    }

    params.delete("page");

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:mb-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5 lg:col-span-5">
          <label className="mb-2 block text-sm font-bold text-slate-800" htmlFor="keyword">
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Nhập tên thủ tục hoặc nội dung cần tìm..."
              className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            />
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-4">
          <label className="mb-2 block text-sm font-bold text-slate-800" htmlFor="category">
            Lĩnh vực
          </label>
          <div className="relative">
            <select
              id="category"
              value={field}
              onChange={(event) => setField(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3.5 pl-4 pr-10 text-sm font-medium outline-none transition-all focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            >
              {FIELD_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 pt-2 md:col-span-3 md:pt-0 lg:col-span-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f7a5a] py-3.5 text-sm font-black tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#186248] focus:ring-4 focus:ring-[#1f7a5a]/30"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            TÌM KIẾM
          </button>
        </div>
      </div>
    </form>
  );
}
