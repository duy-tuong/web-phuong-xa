import Link from "next/link";
import { getProcedures } from "@/services/serviceService";

type DichVuCongDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DichVuCongDetailPage({ params }: DichVuCongDetailPageProps) {
  const { id } = await params;
  const normalizedId = decodeURIComponent(id);
  const procedures = await getProcedures();
  const detail = procedures.find((item) => item.slug === normalizedId);

  if (!detail) {
    return (
      <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1f7a5a]">
            Trang chủ
          </Link>
          <span>›</span>
          <Link href="/dich-vu" className="hover:text-[#1f7a5a]">
            Dịch vụ công
          </Link>
          <span>›</span>
          <span className="font-medium text-slate-700">Không tìm thấy</span>
        </nav>

        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">Không tìm thấy thủ tục</h1>
          <p className="mb-6 text-slate-600">Mã thủ tục bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
          <Link
            href="/dich-vu"
            className="inline-flex items-center justify-center rounded-lg bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#155a42]"
          >
            Quay lại danh sách thủ tục
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#1f7a5a]">
          Trang chủ
        </Link>
        <span>›</span>
        <Link href="/dich-vu" className="hover:text-[#1f7a5a]">
          Dịch vụ hành chính
        </Link>
        <span>›</span>
        <span className="font-medium text-slate-900">Chi tiết thủ tục</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <section className="space-y-8">
          <header className="space-y-5">
            <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">{detail.title}</h1>

            <div>
              <Link
                href={detail.wordTemplateHref}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1f7a5a]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#1f7a5a] transition-colors hover:bg-[#1f7a5a]/5"
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                Tải mẫu Word
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">Thời gian giải quyết</p>
                <p className="text-lg font-bold text-emerald-900">{detail.processingTime}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">Lệ phí</p>
                <p className="text-lg font-bold text-amber-900">{detail.fee}</p>
              </div>
            </div>
          </header>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Hồ sơ cần chuẩn bị</h2>
            <ul className="space-y-3">
              {detail.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#1f7a5a]">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Trình tự thực hiện</h2>
            <ol className="space-y-4">
              {detail.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f7a5a] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/dich-vu/chi-tiet-ho-so/${normalizedId}`}
                className="inline-flex items-center justify-center rounded-lg bg-[#1f7a5a] px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-[#155a42] hover:shadow-lg"
              >
                Nộp hồ sơ trực tuyến
              </Link>
            </div>
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-700">Thao tác nhanh</p>
            <Link
              href={`/dich-vu/chi-tiet-ho-so/${normalizedId}`}
              className="flex w-full items-center justify-center rounded-lg bg-[#1f7a5a] px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#155a42] hover:shadow-lg"
            >
              Nộp hồ sơ trực tuyến
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
