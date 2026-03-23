import Link from "next/link";
import Image from "next/image";

interface TourismCard {
	title: string;
	desc: string;
	tag: string;
	href: string;
	className: string;
	image: string;
}

interface CultureTourismProps {
	tourismCards: TourismCard[];
}

export default function CultureTourism({ tourismCards }: CultureTourismProps) {
	return (
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

			<div className="grid auto-rows-[200px] gap-4 md:gap-6 md:grid-cols-3 md:auto-rows-[300px]">
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
	);
}
