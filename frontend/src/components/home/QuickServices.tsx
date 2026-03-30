// Dịch vụ nhanh
// Cung cấp các liên kết nhanh đến các dịch vụ phổ biến như đăng ký hộ khẩu, nộp thuế, đặt lịch hẹn, v.v.

import Link from "next/link";
import { FileText, Map, Store, MessageSquare } from "lucide-react";

interface ServiceItem {
	title: string;
	desc: string;
	href: string;
	icon?: string;
	color?: string;
}

interface QuickServicesProps {
	quickServices: ServiceItem[];
}

const renderIcon = (iconName?: string, className?: string) => {
	switch (iconName) {
		case "FileText": return <FileText className={className} />;
		case "Map": return <Map className={className} />;
		case "Store": return <Store className={className} />;
		case "MessageSquare": return <MessageSquare className={className} />;
		default: return <FileText className={className} />;
	}
};

export default function QuickServices({ quickServices }: QuickServicesProps) {
	return (
		<section className="mx-auto -mt-16 mb-32 w-full max-w-[1200px] px-4 md:px-6 relative z-10">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{quickServices.map((item) => (
					<Link
						key={item.title}
						href={item.href}
						className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-100"
					>
						<div className={`flex h-14 w-14 lg:h-12 lg:w-12 items-center justify-center rounded-2xl border transition-colors duration-300 ${item.color || "text-emerald-700 bg-emerald-50 border-emerald-100"}`}>
							{renderIcon(item.icon, "h-6 w-6 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300")}
						</div>
						<div>
							<p className="text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">{item.title}</p>
							<p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
