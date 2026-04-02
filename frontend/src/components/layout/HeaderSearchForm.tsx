"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type HeaderSearchFormProps = {
  initialValue?: string;
  onSubmit: (value: string) => void;
};

export default function HeaderSearchForm({ initialValue = "", onSubmit }: HeaderSearchFormProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <input
        className="w-[320px] rounded border border-slate-300 bg-white py-1.5 pl-3 pr-10 text-sm outline-none ring-emerald-600 focus:ring-1"
        placeholder="Nhập từ khóa để tìm kiếm..."
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" aria-label="Tim kiem" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700">
        <Search className="h-[15px] w-[15px]" />
      </button>
    </form>
  );
}
