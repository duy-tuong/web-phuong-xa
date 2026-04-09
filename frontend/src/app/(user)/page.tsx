import HeroBanner from "@/components/home/HeroBanner";
import CultureTourism from "@/components/home/CultureTourism";
import LocalNews from "@/components/home/LocalNews";
import QuickServices from "@/components/home/QuickServices";
import { fetchLibraryPhotos } from "@/services/mediaLibraryService";
import { getArticles } from "@/services/articleService";
import { getHomePageContent } from "@/services/page-content/home";

const TOURISM_LAYOUTS = ["md:col-span-2", "", "", "md:col-span-2"];

export default async function UserHomePage() {
  const { highlightStats, quickServices, tourismCards } = getHomePageContent();
  const [articles, libraryPhotos] = await Promise.all([
    getArticles(),
    fetchLibraryPhotos(4).catch((error) => {
      console.error("Không thể tải hình ảnh thư viện trên trang chủ:", error);
      return [];
    }),
  ]);

  const homepageTourismCards = libraryPhotos.length > 0
    ? libraryPhotos.slice(0, 4).map((photo, index) => ({
        title: "",
        desc: photo.desc,
        tag: index % 2 === 0 ? "Thư viện" : "Văn hóa du lịch",
        href: "/thu-vien/hinh-anh",
        className: TOURISM_LAYOUTS[index] ?? "",
        image: photo.image,
      }))
    : tourismCards.map((card) => ({
        ...card,
        href: "/thu-vien",
      }));

  const homepageArticles = articles.slice(0, 4);

  return (
    <div className="bg-white pb-20 pt-10">
      <HeroBanner highlightStats={highlightStats} />
      <QuickServices quickServices={quickServices} />
      <CultureTourism tourismCards={homepageTourismCards} />
      <LocalNews articles={homepageArticles} />
    </div>
  );
}
