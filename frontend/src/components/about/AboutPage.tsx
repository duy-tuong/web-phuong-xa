import AboutHero from "@/components/about/AboutHero";
import AboutUsSection from "@/components/about/AboutUsSection";
import Demographics from "@/components/about/Demographics";
import GeographySection from "@/components/about/GeographySection";
import HistorySection from "@/components/about/HistorySection";
import { getAboutPageContent } from "@/services/pageContentService";

export default function AboutPage() {
  const { timelineItems, natureCards, statsCards, infrastructureCards } = getAboutPageContent();

  return (
    <main className="bg-[#f8fafc] text-[#111816]">
      <AboutHero />
      <AboutUsSection />
      <HistorySection timelineItems={timelineItems} />
      <GeographySection />
      <Demographics
        natureCards={natureCards}
        statsCards={statsCards}
        infrastructureCards={infrastructureCards}
      />
    </main>
  );
}
