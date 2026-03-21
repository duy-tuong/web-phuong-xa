import FeaturedVideoSection from "@/components/thu-vien/FeaturedVideoSection";
import MediaHeroSection from "@/components/thu-vien/MediaHeroSection";
import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";
import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";

export default function ThuVienTongHopPage() {
  return (
    <main className="flex flex-grow flex-col">
      <MediaHeroSection />

      <div className="w-full bg-[#f8fafc]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
          <FeaturedVideoSection />
          <PhotoLibrarySection />
          <VideoLibrarySection />
        </div>
      </div>
    </main>
  );
}
