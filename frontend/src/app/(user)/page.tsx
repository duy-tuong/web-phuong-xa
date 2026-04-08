//! trang chủ người dùng, hiển thị các thành phần như HeroBanner, CultureTourism, LocalNews, QuickServices
import HeroBanner from "@/components/home/HeroBanner";
import CultureTourism from "@/components/home/CultureTourism";
import LocalNews from "@/components/home/LocalNews";
import QuickServices from "@/components/home/QuickServices";
import { fetchLibraryPhotos } from "@/services/mediaLibraryService"; //! 2. import hàm fetchLibraryPhotos để lấy hình ảnh thư viện từ backend, hiển thị trên trang chủ
import { getArticles } from "@/services/articleService"; //! 1.import hàm getArticles để lấy danh sách bài viết từ backend
import { getHomePageContent } from "@/services/page-content/home";//! 3. import hàm getHomePageContent để lấy nội dung tĩnh trang chủ

const TOURISM_LAYOUTS = ["md:col-span-2", "", "", "md:col-span-2"];

export default async function UserHomePage() {
  const { highlightStats, quickServices, tourismCards } = getHomePageContent();//! 3. gọi hàm getHomePageContent để lấy nội dung tĩnh trang chủ
  const [articles, libraryPhotos] = await Promise.all([
    getArticles(),//!1. gọi hàm getArticles để lấy danh sách bài viết từ backend, hiển thị trên trang chủ
    fetchLibraryPhotos(4).catch((error) => {// !2. gọi hàm fetchLibraryPhotos để lấy hình ảnh thư viện, hiện thị lên trang chủ
      console.error("Không thể tải hình ảnh thư viện trên trang chủ:", error);
      return [];
    }),
  ]);

  const homepageTourismCards = libraryPhotos.length > 0
    ? libraryPhotos.slice(0, 4).map((photo, index) => ({ //! chỉ lấy 4 hình ảnh đầu tiên để hiển thị trên trang chủ
        title: photo.title,
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

  const homepageArticles = articles.slice(0, 4); //! chỉ lấy 4 bài viết mới nhất để hiển thị trên trang chủ

  return (
    <div className="bg-white pb-20 pt-10">
      <HeroBanner highlightStats={highlightStats} />
      <QuickServices quickServices={quickServices} />
      <CultureTourism tourismCards={homepageTourismCards} />
      <LocalNews articles={homepageArticles} />
    </div>
  );
}
