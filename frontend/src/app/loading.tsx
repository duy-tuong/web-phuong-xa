export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-emerald-700">Đang tải dữ liệu...</p>
      </div>
    </main>
  );
}
