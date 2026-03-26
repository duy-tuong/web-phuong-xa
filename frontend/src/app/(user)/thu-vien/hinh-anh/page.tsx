// Công dụng: Hiển thị riêng kho ảnh hoạt động văn hóa, 
// du lịch, đời sống cộng đồng.
import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";

export default function ThuVienHinhAnhPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Thu Vien Hinh Anh</h1>
        <p className="mt-2 text-slate-600">Kho anh hoat dong van hoa, du lich va doi song cong dong Phuong Cao Lanh.</p>
      </div>
      <PhotoLibrarySection />
    </main>
  );
}
