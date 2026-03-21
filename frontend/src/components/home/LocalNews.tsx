import Link from "next/link";
import Image from "next/image";

interface NewsItem {
	title: string;
	href: string;
}

interface LocalNewsProps {
	topNews: NewsItem[];
}

export default function LocalNews({ topNews }: LocalNewsProps) {
	return (
		<section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
			<h2 className="mb-6 text-2xl font-black text-slate-900 md:mb-10 md:text-3xl">Tin Tức Địa Phương</h2>
			<div className="grid gap-8 lg:grid-cols-12">
				<article className="group cursor-pointer lg:col-span-7">
					<div className="mb-6 aspect-video overflow-hidden rounded-3xl">
						<Image
							alt="Tin nổi bật"
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuAynMAidGZRNvfUBOnUXo2dPgOYI1SsTRj6Pqa1m0xb2oxxAMgEYqKclD7J2PASnDs849oZoGOBpFgQjLjNvREf2eynuYHjZJvKGDc-6UjkbJGi9qfRNAuTri_AlJnIN3dZynLcD3wG0xgMSryDKLO5dee93MdQgWk1If4UeUBuzW-mWrFSS0GwCyaGkLAcbl19c8sM32YvaRBtpZEwHBXJzIU37hdom4kS-t9rEUHzOav2MWqJz_P6Ap9pWoxw9BW0eDpv5rRCeFNm"
							width={1200}
							height={700}
							unoptimized
							className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
						/>
					</div>
					<div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
						<span className="font-bold text-emerald-700">Chính quyền</span>
						<span>•</span>
						<span>12 Tháng 10, 2023</span>
					</div>
					<h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition group-hover:text-emerald-700 md:text-3xl">
						Triển khai hội nghị quán triệt chuyên đề học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh
					</h3>
					<p className="text-lg leading-relaxed text-slate-600">
						Sáng nay, Đảng ủy Phường Cao Lãnh đã tổ chức hội nghị học tập, quán triệt chuyên đề năm 2023 cho toàn thể cán bộ, đảng viên trên địa bàn.
					</p>
				</article>

				<div className="flex flex-col lg:col-span-5">
					{topNews.map((item, index) => (
						<Link
							key={item.title}
							href={item.href}
							className={`group border-slate-200 py-6 ${index !== topNews.length - 1 ? "border-b" : ""}`}
						>
							<div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
								<span className="font-bold text-pink-600">Xã hội</span>
								<span>•</span>
								<span>Tháng 10, 2023</span>
							</div>
							<h4 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-700">{item.title}</h4>
						</Link>
					))}
					<Link href="/tin-tuc" className="pt-4 text-sm font-bold text-emerald-700 hover:underline">
						Xem tất cả tin tức
					</Link>
				</div>
			</div>
		</section>
	);
}
