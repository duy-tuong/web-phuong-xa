import Image from "next/image";
import Link from "next/link";

import bgImage from "@/app/(user)/chinhgiaodien/images/backgourd.png";
import logoImage from "@/app/(user)/chinhgiaodien/images/logo.png";

export default function Footer() {
  return (
<<<<<<< HEAD
    <footer className="relative overflow-hidden border-t border-slate-200 bg-gray-100 py-12">
=======
    <footer className="relative overflow-hidden border-t border-slate-200 bg-gray-100 py-10">
>>>>>>> frontend-user-minh-hieu
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full shadow-lg md:h-20 md:w-20">
                <Image src={logoImage} alt="Logo Phường Cao Lãnh" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</span>
                <span className="text-lg font-bold uppercase leading-tight text-emerald-700">PHƯỜNG CAO LÃNH</span>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Trang thông tin chính thức của UBND Phường Cao Lãnh, TP Cao Lãnh, Đồng Tháp. Cung cấp thông tin
              kinh tế - xã hội, dịch vụ công và tin tức địa phương.
            </p>
          </div>

<<<<<<< HEAD
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wide text-emerald-700">Thông tin liên hệ</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-700">
              <li>Trụ sở UBND Phường Cao Lãnh, Số 01, Điện Biên Phủ, TP Cao Lãnh, Đồng Tháp</li>
              <li>Điện thoại: 0277.3851.XXX</li>
              <li>Email: ubndphuongcaolanh@dongthap.gov.vn</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wide text-emerald-700">Liên kết hữu ích</h3>
            <div className="flex flex-col gap-2">
              <Link href="#" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-700 hover:text-emerald-700">
                Cổng Thông tin điện tử Chính phủ
              </Link>
              <Link href="#" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-700 hover:text-emerald-700">
                Cổng Dịch vụ công Quốc gia
              </Link>
              <Link href="#" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-700 hover:text-emerald-700">
                Cổng Thông tin điện tử tỉnh Đồng Tháp
              </Link>
              <Link href="#" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-700 hover:text-emerald-700">
                UBND Thành phố Cao Lãnh
              </Link>
            </div>
=======
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold uppercase tracking-wide text-emerald-700">Thông tin liên hệ</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Trụ sở UBND: Số 03, Đường 30/4, Phường Cao Lãnh, TP Cao Lãnh, Đồng Tháp</li>
              <li>Điện thoại: 0277 3851 234</li>
              <li>Email: phuongcaolanh@dongthap.gov.vn</li>
              <li>Giờ tiếp dân: Sáng Thứ Năm hàng tuần</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold uppercase tracking-wide text-emerald-700">Liên kết hữu ích</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <Link href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-green-600">
                  <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
                  Cổng Thông tin điện tử Chính phủ
                </Link>
              </li>
              <li>
                <Link href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-green-600">
                  <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
                  Cổng Dịch vụ công Quốc gia
                </Link>
              </li>
              <li>
                <Link href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-green-600">
                  <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
                  Cổng Thông tin điện tử tỉnh Đồng Tháp
                </Link>
              </li>
              <li>
                <Link href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-green-600">
                  <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
                  UBND Thành phố Cao Lãnh
                </Link>
              </li>
            </ul>
>>>>>>> frontend-user-minh-hieu
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-300 pt-6 text-sm text-slate-600 md:flex-row">
<<<<<<< HEAD
          <p>© 2024 Cổng Thông tin điện tử Phường Cao Lãnh. Ghi rõ nguồn khi phát hành lại thông tin.</p>
=======
          <p>© 2025 Cổng Thông tin điện tử Phường Cao Lãnh — Thành phố Cao Lãnh, Tỉnh Đồng Tháp. Ghi rõ nguồn khi phát hành lại.</p>
>>>>>>> frontend-user-minh-hieu
          <p className="font-medium">
            Đang online: <span className="font-bold text-emerald-700">15</span> | Tổng truy cập: <span className="font-bold text-emerald-700">1,234,567</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
