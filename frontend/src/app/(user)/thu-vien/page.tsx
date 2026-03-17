import Link from "next/link";

export default function ThuVienTongHopPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Thu vien media tong hop</h2>
      <p className="text-slate-600">Trang tong hop media theo thiet ke chinhgiaodien.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/thu-vien/hinh-anh" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 border border-slate-200">
          Thu vien hinh anh
        </Link>
        <Link href="/thu-vien/video" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 border border-slate-200">
          Thu vien video
        </Link>
      </div>
    </section>
  );
}
