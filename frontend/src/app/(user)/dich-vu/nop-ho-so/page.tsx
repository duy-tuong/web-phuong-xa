import Link from "next/link";

export default function NopHoSoPage() {
	return (
		<section className="space-y-4">
			<nav className="flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
				<Link href="/" className="hover:text-[#1f7a5a]">
					Trang chủ
				</Link>
				<span>&gt;</span>
				<Link href="/dich-vu" className="hover:text-[#1f7a5a]">
					Dịch vụ công
				</Link>
				<span>&gt;</span>
				<span className="font-medium text-slate-900">Nộp hồ sơ</span>
			</nav>

			<div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
				<span className="material-symbols-outlined mb-3 text-6xl text-amber-500">construction</span>
				<h2 className="mb-2 text-2xl font-bold text-slate-900">Tính năng đang phát triển</h2>
				<p className="mx-auto max-w-xl text-slate-600">
					Chức năng Nộp hồ sơ trực tuyến tạm thời chưa sử dụng. Vui lòng quay lại sau khi hệ thống hoàn thiện.
				</p>

				<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
					<Link href="/" className="rounded-lg bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]">
						Quay về trang chủ
					</Link>
					<Link href="/dich-vu" className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
						Về danh sách dịch vụ
					</Link>
				</div>
			</div>
		</section>
	);
}
