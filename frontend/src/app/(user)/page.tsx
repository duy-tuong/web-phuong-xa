import { getHomePageContent } from "@/services/pageContentService";
import HeroBanner from "@/components/home/HeroBanner";
import QuickServices from "@/components/home/QuickServices";
import CultureTourism from "@/components/home/CultureTourism";
import LocalNews from "@/components/home/LocalNews";

export default function UserHomePage() {
	const { highlightStats, quickServices, topNews, tourismCards } = getHomePageContent();

	return (
		<div className="bg-white pb-20 pt-10">
			<HeroBanner highlightStats={highlightStats} />
			<QuickServices quickServices={quickServices} />
			<CultureTourism tourismCards={tourismCards} />
			<LocalNews topNews={topNews} />
		</div>
	);
}
