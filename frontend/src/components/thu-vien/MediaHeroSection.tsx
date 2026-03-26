import Link from "next/link";
import Image from "next/image";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDvehcvzzC1-xYPYkzAP-4M83n7JnWlLUN14bIrQtw9_K1pUvNtOg9OA0l09IjH-17InnWaUqzrLvRY878bLx5vCudRe2nJjqVSN3RQspOaNiScViwnahKpJQQdyoKsWfc1TbpCw3h20H0EH8YZtKQLd8e-t-MnrrJXODJWLu2j_D-5ChGyhL9flfWrfP8A5L_mjJOrddmEr4kjET14846v_UXU819m_ONcIZqZctgCMv_WuLHWDMS8WkBbQtYrK6HsoixAMgY8b0yD";

export default function MediaHeroSection() {
  return (
    <section className="relative flex h-[50vh] min-h-[450px] w-full items-center justify-center overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Thu vien media Phuong Cao Lanh"
        fill
        className="object-cover"
        unoptimized
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f231d]/40 to-[#0f231d]/70" />

      <div className="z-10 flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg md:text-6xl">
          Thu Vien Hinh Anh &amp; Video
        </h1>
        <p className="max-w-2xl text-lg font-medium text-slate-100 drop-shadow-md md:text-xl">
          Kham pha net dep van hoa, lich su va con nguoi Phuong Cao Lanh qua nhung khung hinh chan thuc va song dong nhat.
        </p>
        <Link
          href="/thu-vien/hinh-anh"
          className="mt-4 flex items-center gap-2 rounded-full bg-[#1f7a5a] px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#1f7a5a]/90"
        >
          <span>Kham pha ngay</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
