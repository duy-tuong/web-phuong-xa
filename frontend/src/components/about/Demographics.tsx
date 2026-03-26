// Hiển thị thông tin về dân số, cơ cấu dân cư, các số liệu thống 
// kê liên quan đến con người.
"use client";

import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";

interface NatureCard { icon: string; title: string; text: string; image: string; }
interface StatsCard { icon: string; title: string; value: string; hint: string; }
interface InfraCard { title: string; text: string; image: string; }

interface DemographicsProps {
  natureCards: NatureCard[];
  statsCards: StatsCard[];
  infrastructureCards: InfraCard[];
}

function StatCard({ item }: { item: StatsCard }) {
  const { count, ref } = useCountUp(item.value, 2500);

  return (
    <article
      ref={ref}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-900/10 h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="absolute -right-6 -top-6 text-emerald-50 transition-transform duration-700 group-hover:scale-125 group-hover:text-emerald-100/50">
        <span className="material-symbols-outlined select-none text-[150px] leading-none">{item.icon}</span>
      </div>
      
      <div className="relative z-10 flex flex-col h-full items-start w-full">
        <div>
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 shadow-inner">
            <span className="material-symbols-outlined text-3xl drop-shadow-sm">{item.icon}</span>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{item.title}</h3>
          <p className="mt-2 text-5xl font-black tracking-tight text-emerald-800 drop-shadow-md lg:text-5xl border-b-2 border-transparent pb-1 transition-all group-hover:border-emerald-200 inline-block">{count}</p>
        </div>
        
        <div className="mt-auto pt-6 w-full">
          <div className="flex w-full min-h-[48px] items-center gap-2 rounded-xl bg-slate-100/80 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 backdrop-blur-sm border border-white/50">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="break-words whitespace-normal leading-relaxed text-left flex-1" dangerouslySetInnerHTML={{ __html: item.hint }} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Demographics({ natureCards, statsCards, infrastructureCards }: DemographicsProps) {
  return (
    <div className="bg-slate-50">
      {/* 1. Tự nhiên (Nature Image Cards) */}
      <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-emerald-600">Đặc trưng thổ nhưỡng</span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Điều kiện sinh thái</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {natureCards.map((item) => (
            <article key={item.title} className="group relative h-[350px] rounded-[2rem] shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20">
              {/* Wrapper clip hình ảnh — luôn giữ bo góc dù hover scale */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  unoptimized
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-black/20 rounded-[2rem]" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md border border-white/30 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h3 className="mb-3 text-2xl font-black text-white drop-shadow-md">{item.title}</h3>
                <p className="text-sm leading-relaxed text-emerald-50/90 font-medium">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Thống kê */}
      <section className="relative overflow-hidden bg-slate-900 py-24">
        <div className="absolute inset-0 opacity-10 blur-3xl">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tight text-white mb-2">Số liệu mấu chốt</h2>
            <p className="text-emerald-100/70 uppercase tracking-widest font-bold text-sm">Thống kê & Cơ cấu</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {statsCards.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cơ sở hạ tầng */}
      <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Mạng lưới Hạ tầng</h2>
          <p className="text-slate-500 uppercase tracking-widest font-bold text-sm">Phục vụ đời sống - Phát triển đô thị</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infrastructureCards.map((item) => (
            <article key={item.title} className="group relative h-[400px] overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                unoptimized
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-emerald-950/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-sm" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3 className="relative z-20 text-2xl font-black text-white drop-shadow-md transition-transform duration-500 group-hover:-translate-y-4">
                  {item.title}
                </h3>
                <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
                  <p className="overflow-hidden text-sm font-medium leading-relaxed text-emerald-50 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                    {item.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
