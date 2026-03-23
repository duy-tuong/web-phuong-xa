"use client";

import { useEffect, useRef, useState } from "react";

interface TimelineItem {
  year: string;
  title: string;
  shortText: string;
  fullText: string;
}

export default function HistorySection({ timelineItems }: { timelineItems: TimelineItem[] }) {
  // Simple scroll intersection observer for animation
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndices((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    const elements = document.querySelectorAll(".timeline-node");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-24 sm:py-32" ref={sectionRef}>
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-emerald-600">
            Dấu ấn Thời gian
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Lịch sử Phát triển
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Một hành trình vươn mình từ những đơn vị hành chính nhỏ lẻ trở thành 
            trái tim sôi động của toàn bộ khu vực.
          </p>
        </div>

        <div className="relative mt-20">
          {/* Trục thời gian ở giữa (Desktop) hoặc bên trái (Mobile) */}
          <div className="absolute left-6 top-0 h-full w-1 rounded-full bg-slate-200 md:left-1/2 md:-ml-0.5" />

          <div className="space-y-12 md:space-y-32">
            {timelineItems.map((item, index) => {
              const isActive = activeIndices.includes(index);
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={index} 
                  data-index={index}
                  className={`timeline-node relative flex flex-col md:flex-row items-center justify-between ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"} transition-all duration-1000 ease-out`}
                >
                  
                  {/* Node chấm tròn giữa */}
                  <div className={`absolute left-6 top-0 flex h-10 w-10 -translate-x-[18px] items-center justify-center rounded-full border-4 border-slate-50 ${isActive ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110' : 'bg-slate-300'} md:left-1/2 md:top-1/2 md:-translate-y-1/2 z-10 transition-all duration-700`}>
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>

                  {/* Cột dữ liệu - Đổi bên tùy index */}
                  <div className={`ml-16 md:ml-0 flex w-full md:w-[45%] flex-col ${isEven ? "md:items-end md:text-right" : "md:order-last md:items-start"}`}>
                    <div className={`inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold tracking-widest text-emerald-800 shadow-sm ${isEven ? "md:flex-row-reverse" : ""}`}>
                      <span className="material-symbols-outlined text-lg">history_edu</span>
                      {item.year}
                    </div>
                    
                    <h3 className="mt-4 text-3xl font-black text-slate-900 drop-shadow-sm">
                      {item.title}
                    </h3>

                    <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 text-left">
                      <p className="text-base font-semibold leading-relaxed text-emerald-950 mb-3 border-b border-emerald-50 pb-3">
                        {item.shortText}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item.fullText}
                      </p>
                    </div>
                  </div>
                  
                  {/* Spacer cho bên còn lại để căn giữa trục */}
                  <div className="hidden w-[45%] md:block" />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
