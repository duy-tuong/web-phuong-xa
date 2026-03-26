// Công dụng: Hiển thị riêng kho video clip về hoạt động văn hóa, 
// du lịch, đời sống cộng đồng.
import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";

export default function ThuVienVideoPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Kho Video Clip</h1>
        <p className="mt-2 text-slate-600">Video tu lieu gioi thieu hoat dong, van hoa va phat trien dia phuong.</p>
      </div>
      <VideoLibrarySection />
    </main>
  );
}
