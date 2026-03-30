//Phần giới thiệu chung về phường/xã, có thể gồm lịch sử hình thành, 
// sứ mệnh, tầm nhìn, giá trị cốt lõi.
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TABS = [
  {
    id: "ban-sac",
    tab: "Bản sắc",
    title: "Nơi hội tụ bản sắc",
    highlight: "Truyền thống",
    desc: "UBND Phường Cao Lãnh không chỉ là cơ quan hành chính nhà nước, mà còn là người bạn đồng hành, giữ gìn những giá trị văn hoá thiêng liêng của vùng đất Sen Hồng, chuyển giao tốt đẹp qua nhiều thế hệ.",
    image: "https://images.vietnamtourism.gov.vn/vn//images/2019/CNMN/12.11.Ve_TP_Cao_Lanh_tham_khu_di_tich_cu_Pho_bang_Nguyen_Sinh_Sac8.jpg", // b
    color: "from-pink-500 to-rose-400",
    textCol: "text-pink-600",
    bgCol: "bg-pink-100",
    icon: "local_florist"
  },
  {
    id: "hien-dai",
    tab: "Phát triển",
    title: "Vươn tầm hiện đại",
    highlight: "Đô thị văn minh",
    desc: "Quy hoạch và phát triển không gian sống hiện đại, đồng bộ về hạ tầng giao thông, tạo ra môi trường sống Sáng - Xanh - Sạch - Đẹp cho cộng đồng dân cư toàn phường.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/V%C4%83n_mi%E1%BA%BFu_Cao_L%C3%A3nh_v%E1%BB%81_%C4%91%C3%AAm.jpg",
    color: "from-emerald-500 to-teal-400",
    textCol: "text-emerald-600",
    bgCol: "bg-emerald-100",
    icon: "apartment"
  },
  {
    id: "chuyen-doi-so",
    tab: "Đổi mới",
    title: "Cải cách thủ tục",
    highlight: "Chính quyền số",
    desc: "Với triết lý \"Lấy người dân làm trung tâm\", chúng tôi liên tục đổi mới, áp dụng mạnh mẽ chuyển đổi số để mọi thủ tục hành chính trở nên thân thiện, tiện lợi và minh bạch nhất.",
    image: "https://cdn2.baodongthap.vn/image/ckeditor/2026/20260119/files/wm_4_th_3.jpg",
    color: "from-blue-500 to-cyan-400",
    textCol: "text-blue-600",
    bgCol: "bg-blue-100",
    icon: "important_devices"
  }
];

export default function AboutUsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTab = TABS[activeIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TABS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Cột Text - Interactive Story */}
          <div className="relative z-10 flex flex-col h-full justify-center">

            {/* Các nút Tab nằm dọc hoặc ngang */}
            <div className="mb-8 flex flex-wrap gap-2">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${activeIdx === idx
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.tab}
                </button>
              ))}
            </div>

            {/* Khối Nội dung Text mượt mà thay đổi (Fade Effect via React Key) */}
            <div key={activeTab.id} className="animate-fade-in-up">
              <h2 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl lg:text-5xl">
                {activeTab.title}<br />
                <span className={`mt-1.5 inline-block ${activeTab.textCol}`}>{activeTab.highlight}</span>
              </h2>

              <div className="mt-6 space-y-6 text-lg leading-relaxed text-slate-600 min-h-[150px]">
                <p className="relative pl-6 leading-loose">
                  <span className={`absolute left-0 top-2 h-full w-1.5 rounded-full bg-gradient-to-b ${activeTab.color}`} />
                  {activeTab.desc}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 w-fit">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${activeTab.bgCol} ${activeTab.textCol}`}>
                  <span className="material-symbols-outlined text-2xl">{activeTab.icon}</span>
                </div>
                <p className="text-sm font-medium text-slate-600 leading-snug">
                  <span className={`block ${activeTab.textCol} font-bold uppercase tracking-wider mb-1 text-xs`}>{activeTab.highlight}</span>
                  Luôn song hành cùng sự phát triển của thành phố.
                </p>
              </div>
            </div>
          </div>

          {/* Cột Hình ảnh - Đổi hình có hiệu ứng Fade */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-2xl">
              {TABS.map((tab, idx) => (
                <Image
                  key={tab.id}
                  src={tab.image}
                  alt={tab.title}
                  fill
                  className={`object-cover transition-all duration-[1500ms] ease-in-out ${activeIdx === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
                    }`}
                  unoptimized
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />
            </div>

            {/* Badge Decor */}
            <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 border-slate-50 bg-slate-900 p-4 text-center text-white shadow-2xl z-30">
              <span className={`material-symbols-outlined mb-1 text-4xl transition-colors duration-500 ${activeTab.textCol}`}>verified</span>
              <span className="text-[11px] uppercase tracking-widest font-bold opacity-90 mt-1 leading-tight">Cam kết<br />Chất lượng</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
