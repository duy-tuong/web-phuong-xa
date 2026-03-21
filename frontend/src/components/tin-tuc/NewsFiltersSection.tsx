export default function NewsFiltersSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 sm:text-4xl">
          Tin Tức &amp; Sự Kiện Địa Phương
        </h1>
        <p className="max-w-3xl text-base font-normal leading-relaxed text-slate-600">
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
          />
        </div>

        <div className="relative flex h-12 w-full items-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#1f7a5a]/50 sm:w-48">
          <span className="material-symbols-outlined ml-3 mr-2 text-slate-400">calendar_today</span>
          <select className="h-full w-full cursor-pointer appearance-none border-none bg-transparent pr-8 text-sm text-slate-700 outline-none">
            <option value="all">Thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="custom">Chọn ngày...</option>
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 align-middle text-slate-400">expand_more</span>
        </div>

        <button className="h-12 rounded-lg bg-[#1f7a5a] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90">
          Tìm kiếm
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-3">
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full bg-[#1f7a5a] px-6 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg">
            Tất cả
          </button>
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1f7a5a] hover:text-[#1f7a5a]">
            Chính trị - Xã hội
          </button>
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1f7a5a] hover:text-[#1f7a5a]">
            Kinh tế
          </button>
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1f7a5a] hover:text-[#1f7a5a]">
            Văn hóa - Thể thao
          </button>
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1f7a5a] hover:text-[#1f7a5a]">
            Thông báo khẩn
          </button>
        </div>
      </div>
    </section>
  );
}
