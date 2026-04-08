//! công dụng của component này là hiển thị phần văn hóa và du lịch trên trang chủ, với các thẻ thông tin về các điểm đến nổi bật, các sự kiện văn hóa, và các hoạt động du lịch đặc trưng của Phường Cao Lãnh. Mỗi thẻ sẽ có hình ảnh minh họa, tiêu đề, mô tả ngắn gọn, và một liên kết để người dùng có thể khám phá thêm chi tiết về từng điểm đến hoặc sự kiện.
import Image from "next/image";
import Link from "next/link";

interface TourismCard {
  title: string;
  desc: string;
  tag: string;
  href: string;
  className: string;
  image: string;
}

interface CultureTourismProps {
  tourismCards: TourismCard[];
}

export default function CultureTourism({ tourismCards }: CultureTourismProps) {
  return (
    <section className="mx-auto mb-24 w-full max-w-[1200px] px-4 md:px-6">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Văn Hóa &amp; Du Lịch</h2>
          <p className="mt-2 text-slate-600">Khám phá những nét đẹp đặc trưng của Phường Cao Lãnh.</p>
        </div>
        <Link href="/thu-vien" className="hidden text-sm font-bold text-emerald-700 hover:underline md:inline-flex">
          Xem tất cả
        </Link>
      </div>
{/* LƯU Ý 1: GRID AUTO-ROWS (Kiểm soát chiều cao đồng đều) */}
      {/* Thay vì fix cứng chiều cao từng thẻ, em dùng auto-rows-[200px] (mobile) và 300px (desktop). 
          Giúp các thẻ luôn bằng nhau chằn chặn dù nội dung bên trong có ngắn hay dài. */}
      <div className="grid auto-rows-[200px] gap-4 md:auto-rows-[300px] md:grid-cols-3 md:gap-6">
        {tourismCards.map((item, index) => (
          <Link
            key={`${item.title}-${item.href}-${index}`}
            href={item.href}
      // LƯU Ý 2: KỸ THUẬT "BENTO GRID" VỚI CLASSNAME ĐỘNG
            // Thuộc tính `${item.className}` Nó cho phép component cha (page.tsx) quyết định thẻ này chiếm 1 cột (mặc định) hay kéo dài sang 2 cột
            className={`group relative overflow-hidden rounded-3xl ${item.className}`}
          >
        {/* LƯU Ý 3: NEXT/IMAGE VỚI THUỘC TÍNH FILL */}
            {/* Dùng thuộc tính `fill` kết hợp `object-cover` để ảnh tự động co giãn lấp đầy không gian thẻ mà không bị méo tỉ lệ. Bắt buộc thẻ cha phải có class `relative`. */}  
            <Image
              src={item.image}
              alt={item.title}
              fill
              unoptimized
              className="object-cover transition duration-700 group-hover:scale-110"
            />
        {/* LƯU Ý 4: BẢO VỆ TRẢI NGHIỆM ĐỌC (UX - Text Contrast) */}
            {/* Đây là lớp phủ gradient từ đen mờ lên trong suốt. Bắt buộc phải có! Nếu không có lớp này, khi gặp một tấm ảnh nền màu trắng sáng, chữ màu trắng bên trên sẽ bị "tàng hình" hoàn toàn. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <span className="mb-3 w-max rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">{item.tag}</span>
              <h3 className="text-xl font-bold text-white md:text-2xl">{item.title}</h3>
           {/* LƯU Ý 5: CHỐNG VỠ LAYOUT BẰNG LINE-CLAMP */}
              {/* Nếu mô tả (desc) quá dài, `line-clamp-2` sẽ cắt bớt chữ và thêm dấu "..." ở cuối dòng thứ 2, đảm bảo text không bị tràn ra ngoài khung ảnh. */}
              <p className="mt-2 line-clamp-2 text-sm text-white/85">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
