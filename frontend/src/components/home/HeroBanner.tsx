"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface StatItem {
  value: string;
  label: string;
}

interface HeroBannerProps {
  highlightStats: StatItem[];
}

const HERO_SLIDES = [
  {
    titlePrefix: "Khát vọng",
    titleHighlight: "Cao Lãnh",
    description: "Cổng thông tin điện tử và du lịch Phường Cao Lãnh, Đồng Tháp mang đậm dấu ấn văn hóa Hoa Sen.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8tH_l9I4gK5lguwRoyhlMNtwIwdGZZoHpcvl0wuwuknmzrxJt1bBKL98ecJEmk3IfwYZSpmAKaQX5UN2atjEBxAwIzfbsr4z8dkqChZ4_wzb5aQFRLifaLWKKugE1nWtKn_QtzjhnK_bLcGn7Hbr0JRzjjPlJggzKhkantTKZ88guKVJtV5kWadcuGKQcUcnYFAWTMAKIm1U4WgTr7AlnNzd6bTqA0zPcArb9UePy1fKUd2C5-cDRf5-jOJgGiyOAWTl8Knz7ptJa",
    textColor: "text-pink-600",
    indicatorColor: "bg-pink-600",
    blobColor: "bg-pink-600/10",
  },
  {
    titlePrefix: "Chuyển đổi số",
    titleHighlight: "Toàn diện",
    description: "Tiên phong ứng dụng công nghệ thông tin trong các dịch vụ hành chính, mang lại tiện ích tối đa cho người dân Cao Lãnh.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    textColor: "text-[#1877F2]",
    indicatorColor: "bg-[#1877F2]",
    blobColor: "bg-[#1877F2]/10",
  },
  {
    titlePrefix: "Văn hóa",
    titleHighlight: "Đặc sắc",
    description: "Trải nghiệm và khám phá những sự kiện văn hóa, lễ hội đặc trưng, kết tinh giá trị truyền thống Đồng Tháp Mười.",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1600&auto=format&fit=crop",
    textColor: "text-amber-500",
    indicatorColor: "bg-amber-500",
    blobColor: "bg-amber-500/10",
  },
];

export default function HeroBanner({ highlightStats }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsFading(false);
      }, 300);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section className="mx-auto mb-16 w-full max-w-[1200px] px-4 md:mb-24 md:px-6">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <div className={`transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}>
            <h1 className="py-2 text-4xl font-black leading-tight text-slate-900 sm:text-5xl md:text-7xl">
              {activeSlide.titlePrefix}
              <span className={`mt-1 block transition-colors duration-500 ${activeSlide.textColor}`}>
                {activeSlide.titleHighlight}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-xl">
              {activeSlide.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white/70 p-4 backdrop-blur sm:grid-cols-4">
            {highlightStats.map((item) => (
              <div key={item.label} className="flex flex-col">
                <p className={`text-2xl font-black transition-colors duration-500 ${activeSlide.textColor}`}>
                  <AnimatedNumber value={item.value} />
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/dich-vu/tra-cuu" className={`rounded-full px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${activeSlide.indicatorColor}`}>
              Tra cứu hồ sơ
            </Link>
            <Link href="/thu-vien" className="rounded-full border-2 border-slate-200 px-8 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Khám phá văn hóa
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsFading(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? `w-8 ${activeSlide.indicatorColor}` : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                aria-label={`Chuyển tới slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative aspect-square w-full md:aspect-[4/3]">
          <div className={`absolute inset-0 rotate-3 scale-105 rounded-[4rem] transition-colors duration-700 ${activeSlide.blobColor}`} />
          <div className="relative z-10 h-full w-full overflow-hidden rounded-[3rem] shadow-2xl">
            {HERO_SLIDES.map((slide, index) => (
              <Image
                key={index}
                alt={`Hero Slide ${index + 1}`}
                src={slide.image}
                fill
                unoptimized
                className={`object-cover transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
