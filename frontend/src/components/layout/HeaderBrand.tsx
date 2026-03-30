import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

type HeaderBrandProps = {
  compact?: boolean;
  logoImage: StaticImageData;
};

export default function HeaderBrand({ compact = false, logoImage }: HeaderBrandProps) {
  if (compact) {
    return (
      <Link href="/" aria-label="Trang chủ" className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <Image src={logoImage} alt="Logo Phường Cao Lãnh" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[10px] font-bold tracking-wide text-red-600">CỔNG THÔNG TIN ĐIỆN TỬ</p>
          <p className="truncate text-[14px] font-black text-emerald-700">PHƯỜNG CAO LÃNH</p>
          <p className="truncate text-[10px] text-slate-600">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full md:h-28 md:w-28">
        <Image src={logoImage} alt="Logo Phường Cao Lãnh" className="h-full w-full object-cover" priority />
      </div>
      <div className="text-center md:text-left">
        <p className="text-xs font-bold tracking-wider text-red-600 md:text-sm">CỔNG THÔNG TIN ĐIỆN TỬ</p>
        <h1 className="text-xl font-black uppercase leading-tight text-emerald-700 md:text-3xl">PHƯỜNG CAO LÃNH</h1>
        <p className="text-xs font-medium text-slate-600 md:text-sm">Thành phố Cao Lãnh - Tỉnh Đồng Tháp</p>
      </div>
    </div>
  );
}

