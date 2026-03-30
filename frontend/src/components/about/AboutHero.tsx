//Component phần đầu trang (hero section), thường hiển thị tiêu đề lớn, 
// hình ảnh hoặc slogan nổi bật về phường/xã.
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import bannerGioiThieu from "@/app/(user)/chinhgiaodien/images/banner-gioi-thieu.png";
import anhDepDongThap from "@/app/(user)/chinhgiaodien/images/anh-dep-dong-thap-6.jpg";
import dothitrencao from "@/app/(user)/chinhgiaodien/images/do-thi-tren-cao.jpg";

const SLIDES = [
  {
    id: 1,
    image: bannerGioiThieu, // Hình mặc định của phường
    title: "VỀ CHÚNG TÔI",
    subtitle: "UBND Phường Cao Lãnh — Nơi giao thoa giữa truyền thống và hiện đại",
    titleClass: "text-emerald-50 drop-shadow-lg",
    descClass: "text-emerald-50",
    gradient: "from-emerald-900/40 via-black/40 to-black/30",
  },
  {
    id: 2,
    image: anhDepDongThap, // Hình ảnh hoa sen bạn đã tải về máy!
    title: "VĂN HÓA ĐẶC SẮC",
    subtitle: "Vùng đất mang đậm dấu ấn Hoa Sen, vươn mình trong gian khó",
    titleClass: "text-pink-100 drop-shadow-lg",
    descClass: "text-pink-50",
    gradient: "from-pink-900/40 via-black/40 to-black/30",
  },
  {
    id: 3,
    image: dothitrencao, // Hình ảnh thành phố hiện đại từ trên cao
    title: "ĐÔ THỊ VĂN MINH",
    subtitle: "Kiến tạo môi trường Sáng - Xanh - Sạch - Đẹp cho mọi người dân",
    titleClass: "text-blue-100 drop-shadow-lg",
    descClass: "text-blue-50",
    gradient: "from-blue-900/40 via-black/40 to-black/30",
  },
];

export default function AboutHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000); // 7 giây
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[52vh] min-h-[420px] max-h-[760px] w-full overflow-hidden bg-slate-900 shadow-sm md:h-[58vh] lg:h-[70vh] xl:h-[78vh]">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={`h-full w-full object-cover object-center transition-transform duration-[12000ms] ease-out lg:object-[center_42%] ${index === currentSlide ? "scale-[1.02]" : "scale-100"
              }`}
            priority={index === 0}
            unoptimized={typeof slide.image === "string"}
            sizes="100vw"
          />
          {/* Lớp phủ Gradient mượt mà, đổi màu theo từng slide */}
          <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient} transition-colors duration-1000`} />
        </div>
      ))}

      {/* Nội dung Slide */}
      <div className="absolute inset-0 z-20 mx-auto flex h-full w-full max-w-[1360px] items-center px-4 sm:px-8 lg:px-12 xl:px-16">
        <div
          className="max-w-3xl transform translate-y-0 opacity-100 transition-all duration-1000 ease-out lg:max-w-4xl"
          key={currentSlide} // Bắt buộc React render lại để chạy anims CSS nội bộ nếu cần
        >
          <div className="inline-flex animate-fade-in-up items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-white backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            UBND PHƯỜNG CAO LÃNH
          </div>

          <h1
            className={`animate-fade-in-up py-2 text-4xl font-black uppercase leading-tight sm:text-5xl md:text-6xl xl:text-7xl ${SLIDES[currentSlide].titleClass}`}
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            {SLIDES[currentSlide].title}
          </h1>

          <p
            className={`mt-6 animate-fade-in-up text-lg font-light leading-relaxed drop-shadow-md md:text-2xl lg:mt-8 lg:max-w-3xl ${SLIDES[currentSlide].descClass}`}
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            {SLIDES[currentSlide].subtitle}
          </p>
        </div>
      </div>

      {/* Slide Indicators - Chấm tròn */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-4 md:bottom-8 lg:bottom-10">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Chuyển đến slide ${index + 1}`}
            className="group relative flex h-4 items-center justify-center p-2"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ease-out ${currentSlide === index
                ? "w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                : "w-3 bg-white/40 group-hover:bg-white/80"
                }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
