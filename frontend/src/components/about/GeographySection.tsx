"use client";

import { useState } from "react";

const FLIP_CARDS = [
  { dir: "Bắc", title: "Phía Bắc", icon: "north", desc: "Giáp khu dân cư và trung tâm hành chính TP. Cao Lãnh hiện hữu.", color: "from-blue-500 to-cyan-400" },
  { dir: "Nam", title: "Phía Nam", icon: "south", desc: "Giáp các tuyến đường trục chính, hướng ra khu vực tự nhiên.", color: "from-emerald-500 to-teal-400" },
  { dir: "Đông", title: "Phía Đông", icon: "east", desc: "Kết nối trục kinh tế phía Đông với các phường bạn sầm uất.", color: "from-amber-500 to-orange-400" },
  { dir: "Tây", title: "Phía Tây", icon: "west", desc: "Giáp khu du lịch sinh thái và các xã mang đậm nét đặc trưng.", color: "from-pink-500 to-rose-400" }
];

export default function GeographySection() {
  const [, setHoveredDir] = useState<string | null>(null);

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 right-0 -m-32 h-[500px] w-[500px] rounded-full bg-emerald-50/50 blur-3xl" />

      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 text-center relative z-10">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-emerald-600">
            Vị trí chiến lược
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Địa giới Hành chính
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 leading-relaxed">
            Phường Cao Lãnh sở hữu vị trí lõi trung tâm, với sự thay đổi cảnh quan và kết nối đặc sắc theo từng hướng.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Cột Map - giống trang Liên Hệ */}
          <div className="order-2 lg:order-1 relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-emerald-900/5">
            <iframe
              title="Bản đồ UBND Phường Cao Lãnh"
              src="https://www.google.com/maps?q=03+%C4%91%C6%B0%E1%BB%9Dng+30%2F4%2C+Ph%C6%B0%E1%BB%9Dng+Cao+L%C3%A3nh%2C+Th%C3%A0nh+ph%E1%BB%91+Cao+L%C3%A3nh%2C+%C4%90%E1%BB%93ng+Th%C3%A1p&output=embed"
              className="h-[500px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://www.google.com/maps/search/?api=1&query=03+%C4%91%C6%B0%E1%BB%9Dng+30%2F4%2C+Ph%C6%B0%E1%BB%9Dng+Cao+L%C3%A3nh%2C+Th%C3%A0nh+ph%E1%BB%91+Cao+L%C3%A3nh%2C+%C4%90%E1%BB%93ng+Th%C3%A1p"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-emerald-800"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
              Chỉ đường
            </a>
          </div>

          {/* Cột 4 thẻ lật (Flip Cards) */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {FLIP_CARDS.map((item) => (
                <div
                  key={item.dir}
                  className="group relative h-48 sm:h-56 w-full cursor-pointer perspective-[1000px]"
                  onMouseEnter={() => setHoveredDir(item.dir)}
                  onMouseLeave={() => setHoveredDir(null)}
                >
                  <div className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                    {/* Mặt trước */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-sm [backface-visibility:hidden]">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg shadow-slate-200`}>
                        <span className="material-symbols-outlined text-3xl text-white">{item.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800">{item.title}</h3>
                      <p className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest text-center animate-pulse">
                        Lướt xem chi tiết
                      </p>
                    </div>

                    {/* Mặt sau */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} p-6 px-4 text-center text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
                      <span className="material-symbols-outlined mb-3 text-4xl opacity-50">{item.icon}</span>
                      <p className="text-sm font-medium leading-relaxed sm:text-base drop-shadow-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
