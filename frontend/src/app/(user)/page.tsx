import Link from "next/link";
import Image from "next/image";

const highlightStats = [
	{ value: "35K+", label: "Dân số" },
	{ value: "107", label: "Diện tích (ha)" },
	{ value: "450+", label: "Doanh nghiệp" },
	{ value: "12", label: "Cơ sở giáo dục" },
];

const quickServices = [
	{ title: "Hộ tịch", desc: "Khai sinh, kết hôn, xác nhận hộ tịch", href: "/dich-vu-hc/nop-ho-so" },
	{ title: "Đất đai", desc: "Tra cứu quy hoạch và thông tin địa chính", href: "/dich-vu-hc/tra-cuu" },
	{ title: "Kinh doanh", desc: "Đăng ký, cấp đổi và điều chỉnh giấy phép", href: "/dich-vu-hc" },
	{ title: "Góp ý", desc: "Gửi phản ánh và kiến nghị đến địa phương", href: "/lien-he" },
];

const topNews = [
	{ title: "Triển khai tiêm vắc xin đợt 3 cho trẻ dưới 5 tuổi", href: "/tin-tuc/1" },
	{ title: "Lịch tiếp dân: Thứ 3 và Thứ 5 hằng tuần tại UBND", href: "/tin-tuc/2" },
	{ title: "Thông báo hỗ trợ vay vốn sản xuất kinh doanh năm 2026", href: "/tin-tuc/3" },
];

const tourismCards = [
	{
		title: "Đền thờ & Di tích lịch sử",
		desc: "Tìm hiểu những giá trị văn hóa, lịch sử lâu đời được gìn giữ qua nhiều thế hệ.",
		tag: "Di tích",
		href: "/gioi-thieu",
		className: "md:col-span-2",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBvigYo206ZKoWJYA19Rlm85pnGIFysx5ZGT_DxSeucoAUNzDgWNO9SIZYi3Frxrz_8HsVcPqNFfhbT7JQTW1UfWV7F6c7vQYSvXiW4bRyShrXb5-lps_Uaty52wl81e3BhfGOVC9GYNT9JgU6dPr8D98edlGllNGdiY8pxqJ9z9oRd3boibJ2JhuE9PMDPUPJipn4aCSxbuhtQWqtGVJuTpWC1nL6Eo7Xh6QOmXoczJ99AkYg-Ho73IUXuOE2lZO8ESX2lBFjLYrFF",
	},
	{
		title: "Chợ truyền thống",
		desc: "Trải nghiệm nhịp sống sôi động và ẩm thực đặc sắc địa phương.",
		tag: "Mua sắm",
		href: "/thu-vien",
		className: "",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDBv5sNqZtteiu-1ZeIzNCrWQCfCfVWpZd2hK3PZxsj1VOvwrEwQ40lFsiGAfiOFHoG3iarSt8c4huFFlihpcTnquGhOfGEV2noofnKbpQ9zb5_39iX-g9tUVJlGyC353jKh71hrQM1FnMlzS7fHbkpSACc1in4kOr7M-AbqgSAWgHrusMQ2gmgVbZXB7rX31r1bXnkL_PSPUMOPAofX0SdQUjD0HLww1aNv2REsRS5JtG5BciuddV9cCbVRyZh1vrMZLxq6bmx0ccO",
	},
	{
		title: "Khu sinh thái",
		desc: "Hòa mình vào thiên nhiên miệt vườn sông nước chân chất.",
		tag: "Thiên nhiên",
		href: "/thu-vien/hinh-anh",
		className: "",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDwYVpbmehJll2ftWcua2h_6JjwUDEs_gtSc9XzV4RpRWP9O5aGqNcFwJT4D186fZbypN-xDgpgij0S1D6BGHkkKYTfCgbUP1aTiewXO7KUpU71Gce1u5wSk5Zo7NPI59by3pdlEKxV-K9siPb7Gwx51cGCJ6yGuT5iml1HBseO_TYzM03dN8lp8iG_EXBO_RaO6LPv0eA1FykryHW093hJmUNqOzznQIk_Ikl_piW8b_-ObEQbhQ9Bet_EO8o6UiGOJ5BVMvI6NDKa",
	},
	{
		title: "Lễ hội Sen Đồng Tháp",
		desc: "Sự kiện văn hóa đặc sắc tôn vinh vẻ đẹp của loài hoa biểu tượng vùng đất sen hồng.",
		tag: "Sự kiện",
		href: "/tin-tuc",
		className: "md:col-span-2",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAa57Uo1kzwO8sFatH5iyrm980VTc7JsTDDVNrThk26aLCc0G1HQCNGB_1qmmv_HP_bF_pGMb6STNG6QR0Akky9adKFl86zXWVhtRo9JKXnqkAuv4S7Wv1S0SLYYGuZTCa4WooG9zVKa2hU9cyT_IoxrjiXAFTJyjNqUrbmEWO4UtoRikm4Jjq0_WN7rKRnOzzeR_1k7YmYTjgq3SNrPaA5HPHnT-KP7NghN3gWvMzFhXz5OZ5xVzDP70U81PVOjpVVwl6gM6A56_NY",
	},
];

export default function UserHomePage() {
	return (
		<div className="bg-white pb-20 pt-10">
			<section className="mx-auto mb-24 w-full max-w-[1200px] px-4 md:px-6">
				<div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
					<div>
						<h1 className="text-5xl font-black leading-[1.1] text-slate-900 md:text-7xl">
							Khát Vọng
							<span className="block text-emerald-700">Cao Lãnh</span>
						</h1>
						<p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
							Cổng thông tin điện tử và du lịch Phường Cao Lãnh, Đồng Tháp mang đậm dấu ấn văn hóa Hoa Sen.
						</p>

						<div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white/70 p-4 backdrop-blur sm:grid-cols-4">
							{highlightStats.map((item) => (
								<div key={item.label} className="flex flex-col">
									<p className="text-2xl font-black text-emerald-700">{item.value}</p>
									<p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
								</div>
							))}
						</div>

						<div className="mt-6 flex flex-wrap gap-4">
							<Link href="/dich-vu-hc/tra-cuu" className="rounded-full bg-emerald-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800">
								Tra cứu hồ sơ
							</Link>
							<Link href="/thu-vien" className="rounded-full border-2 border-pink-600 px-8 py-3.5 text-sm font-bold text-pink-700 transition hover:bg-pink-600 hover:text-white">
								Khám phá văn hóa
							</Link>
						</div>
					</div>

					<div className="relative aspect-square w-full md:aspect-[4/3]">
						<div className="absolute inset-0 rotate-3 scale-105 rounded-[4rem] bg-emerald-700/10" />
						<Image
							alt="Hoa sen Đồng Tháp"
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8tH_l9I4gK5lguwRoyhlMNtwIwdGZZoHpcvl0wuwuknmzrxJt1bBKL98ecJEmk3IfwYZSpmAKaQX5UN2atjEBxAwIzfbsr4z8dkqChZ4_wzb5aQFRLifaLWKKugE1nWtKn_QtzjhnK_bLcGn7Hbr0JRzjjPlJggzKhkantTKZ88guKVJtV5kWadcuGKQcUcnYFAWTMAKIm1U4WgTr7AlnNzd6bTqA0zPcArb9UePy1fKUd2C5-cDRf5-jOJgGiyOAWTl8Knz7ptJa"
							width={1600}
							height={1000}
							unoptimized
							className="relative z-10 h-full w-full rounded-[3rem] object-cover shadow-2xl"
						/>
					</div>
				</div>
			</section>

			<section className="mx-auto -mt-16 mb-32 w-full max-w-[1200px] px-4 md:px-6">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{quickServices.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition hover:-translate-y-1"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/10 text-sm font-bold text-emerald-700">
								{item.title.slice(0, 2).toUpperCase()}
							</div>
							<div>
								<p className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">{item.title}</p>
								<p className="mt-1 text-sm leading-6 text-slate-600">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className="mx-auto mb-24 w-full max-w-[1200px] px-4 md:px-6">
				<div className="mb-10 flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-black text-slate-900 md:text-4xl">Văn Hóa & Du Lịch</h2>
						<p className="mt-2 text-slate-600">Khám phá những nét đẹp đặc trưng của Phường Cao Lãnh.</p>
					</div>
					<Link href="/thu-vien" className="hidden text-sm font-bold text-emerald-700 hover:underline md:inline-flex">
						Xem tất cả
					</Link>
				</div>

				<div className="grid auto-rows-[250px] gap-6 md:grid-cols-3 md:auto-rows-[300px]">
					{tourismCards.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							className={`group relative overflow-hidden rounded-3xl ${item.className}`}
						>
							<Image
								src={item.image}
								alt={item.title}
								fill
								unoptimized
								className="object-cover transition duration-700 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
							<div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
								<span className="mb-3 w-max rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">{item.tag}</span>
								<h3 className="text-xl font-bold text-white md:text-2xl">{item.title}</h3>
								<p className="mt-2 line-clamp-2 text-sm text-white/85">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
				<h2 className="mb-10 text-3xl font-black text-slate-900">Tin Tức Địa Phương</h2>
				<div className="grid gap-10 lg:grid-cols-12">
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
						<h3 className="mb-4 text-3xl font-bold leading-tight text-slate-900 transition group-hover:text-emerald-700">
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
		</div>
	);
}
