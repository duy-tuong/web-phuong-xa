// Công dụng: Hiển thị hiệu ứng chờ trong lúc lấy dữ liệu hồ sơ từ server.
export default function DichVuLoading() {
  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-slate-50 py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-80 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-6 w-[520px] max-w-full animate-pulse rounded bg-slate-200" />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full space-y-6 lg:w-2/3">
            <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="h-72 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
          <div className="w-full space-y-6 lg:w-1/3">
            <div className="h-56 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="h-44 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    </main>
  );
}
