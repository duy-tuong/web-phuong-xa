/*Khi Next.js không tìm thấy route phù hợp, component này sẽ tự động được render.
Giao diện gồm:
Icon cảnh báo lớn ở giữa.
Dòng chữ “Lỗi 404” và tiêu đề “Không tìm thấy trang”.*/
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg sm:p-12">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10" fill="none">
            <path d="M12 9v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 3c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Lỗi 404</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Không tìm thấy trang</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Rất tiếc, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-700 px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800"
        >
          Quay lại Trang chủ
        </Link>
      </div>
    </main>
  );
}
