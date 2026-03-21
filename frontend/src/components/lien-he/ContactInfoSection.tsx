import Image from "next/image";
import Link from "next/link";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWVmiGLbxtR4BwsnmH2qqcAf5La-8F5fFuX6D7alGsB2I7DtvLzqFXT4S8VkWf4EILC46qHE9TlOqaUU1-kNB2vCMy_9qVGTwabLCeKpz9wgC68NCu2hirxGbD0TEggfTeOzVpQvIeP6LEd82DMlZMdXreLIkqp18cOYveGCYtvd8Ih18k5YB-Tdcub5j6wGdmzE3fNOrbIrPYMb8G39jfiKRX43FrvpgznT9d3VgUShnRQi2nWko4HojTJOaAyC22KynpOsk4JNN";

export default function ContactInfoSection() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 border-b border-slate-200 pb-4 text-xl font-bold text-slate-900">Thông tin liên hệ</h2>

        <ul className="space-y-6">
          <li className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">Địa chỉ</p>
              <p className="text-lg font-semibold text-slate-900">Số 123, Đường A, Phường Cao Lãnh, Đồng Tháp</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">Hotline</p>
              <p className="text-lg font-semibold text-slate-900">0277 3851 234</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-900">phuongcaolanh@dongthap.gov.vn</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">Giờ làm việc</p>
              <p className="text-base font-semibold text-slate-900">
                Thứ 2 - Thứ 6: Sáng 7:30 - 11:30
                <br />
                Chiều 13:30 - 17:00
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-100 bg-slate-200 shadow-sm">
        <Image
          src={MAP_IMAGE}
          alt="Bản đồ Phường Cao Lãnh"
          fill
          className="object-cover"
          unoptimized
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <Link
          href="#"
          className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-md"
        >
          <span className="material-symbols-outlined text-sm text-[#1f7a5a]">directions</span>
          Chỉ đường
        </Link>
      </div>
    </div>
  );
}
