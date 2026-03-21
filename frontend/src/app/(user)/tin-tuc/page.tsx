import FeaturedNewsSection from "@/components/tin-tuc/FeaturedNewsSection";
import NewsArchiveSection from "@/components/tin-tuc/NewsArchiveSection";
import NewsFiltersSection from "@/components/tin-tuc/NewsFiltersSection";

export default function TinTucListPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <NewsFiltersSection />
      <FeaturedNewsSection />
      <NewsArchiveSection />
    </main>
  );
}
