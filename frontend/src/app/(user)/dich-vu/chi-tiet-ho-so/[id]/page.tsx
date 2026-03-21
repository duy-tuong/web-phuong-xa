import Link from "next/link";

import ServiceDetailFormSection from "@/components/dich-vu/ServiceDetailFormSection";
import ServiceDetailSidebar from "@/components/dich-vu/ServiceDetailSidebar";
import { getProcedures } from "@/services/serviceService";

type DichVuDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function DichVuDetailPage({ params }: DichVuDetailPageProps) {
	const { id } = await params;
	const procedures = await getProcedures();
	const selectedProcedureTitle = procedures.find((item) => item.slug === id)?.title ?? "Thủ tục đang chọn";

	return (
		<main className="flex-1">
			<section className="border-b border-slate-200 bg-gradient-to-br from-[#1f7a5a]/5 to-[#db2777]/5 py-8 lg:py-12">
				<div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
					<div className="max-w-2xl">
						<nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
							<Link href="/" className="hover:text-[#1f7a5a]">
								Trang chủ
							</Link>
							<span>›</span>
							<Link href="/dich-vu" className="hover:text-[#1f7a5a]">
								Dịch vụ hành chính
							</Link>
							<span>›</span>
							<span className="font-medium text-slate-900">Nộp hồ sơ</span>
							<span>›</span>
							<span className="font-medium text-slate-900">{selectedProcedureTitle}</span>
						</nav>

						<h2 className="mb-2 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
							Nộp Hồ Sơ Trực Tuyến
						</h2>
						<p className="mb-3 text-base font-semibold text-[#1f7a5a]">Loại hồ sơ: {selectedProcedureTitle}</p>
						<p className="max-w-xl text-lg text-slate-600">
							Giải quyết thủ tục hành chính nhanh chóng, minh bạch và hiệu quả. Tiết kiệm thời gian cho công dân và doanh
							nghiệp tại Phường Cao Lãnh.
						</p>
					</div>
					<div className="hidden size-48 rounded-full bg-gradient-to-tr from-[#1f7a5a]/20 to-[#db2777]/20 blur-3xl opacity-60 md:block" />
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
				<div className="flex flex-col items-start gap-8 lg:flex-row">
					<ServiceDetailFormSection id={id} />
					<ServiceDetailSidebar />
				</div>
			</section>
		</main>
	);
}
