"use client";

import { useState } from "react";
import ServiceSearchBar from "@/components/services/ServiceSearchBar";
import ServiceSidebar from "@/components/services/ServiceSidebar";
import ServiceList from "@/components/services/ServiceList";
import ServiceModals from "@/components/services/ServiceModals";

export default function DichVuHanhChinhPage() {
	const [showTracking, setShowTracking] = useState(false);
	const [showForms, setShowForms] = useState(false);

	return (
		<main className="bg-slate-50 min-h-screen pb-24 pt-8 sm:pt-12">
			<section className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
				{/* Tiêu đề trang */}
				<div className="mb-8 text-center md:mb-10 lg:text-left">
					<h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
						Dịch vụ hành chính công
					</h1>
					<p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg lg:mx-0">
						Cổng thông tin giải quyết thủ tục hành chính trực tuyến Phường Cao Lãnh nhanh chóng, minh bạch và an toàn.
					</p>
				</div>

				{/* Cấu trúc Grid chuẩn Mobile-first */}
				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
					{/* Cột trái: Sidebar (Trên Mobile sẽ tự đẩy xuống hoặc lên tùy CSS, nhưng để lên đầu thì dùng order) */}
					<div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3">
						<ServiceSidebar 
							onOpenTracking={() => setShowTracking(true)} 
							onOpenForms={() => setShowForms(true)} 
						/>
					</div>

					{/* Cột phải: Content chính (Search + Danh sách) */}
					<div className="order-1 flex flex-col lg:order-2 lg:col-span-8 xl:col-span-9">
						<ServiceSearchBar />
						<ServiceList />
					</div>
				</div>
			</section>

			{/* Modal Tra cứu & Tải biểu mẫu */}
			<ServiceModals
				showTracking={showTracking}
				showForms={showForms}
				onCloseTracking={() => setShowTracking(false)}
				onCloseForms={() => setShowForms(false)}
			/>
		</main>
	);
}
