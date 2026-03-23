import Image from "next/image";
import Link from "next/link";

type ArticleDetailContentProps = {
  id: string;
};

const tags = ["Chuyển đổi số", "UBND Phường", "Dịch vụ công"];

const comments = [
  {
    author: "Nguyễn Văn A",
    timeAgo: "2 giờ trước",
    likes: 5,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBpZrj2eP_b6pIV1lIkEIrS9YLnZha8pV5HQrx1Z7WoOiGX4Uy77lJvH2G9Jpp-xSwHy6bjnuHxbngbfiC78dacLbFc_52VHIW6_w3ZzJV1EMSLzGzi92Qxg2U3eDlwVmObaeOkyhfCBjrOjDNaEJ9eLf0FsBphxQWWV9anhwF9IuUP2INw5u_cYCYZW2HK2Aop2Wqvh33ZQzq0w3owSKipR5WaTQ-UXw-_0BwpAmCiMR5e3guZ6I8vMf2sl0NLy6QLZKD57mCH1qD",
    content:
      "Rất mong phường sớm triển khai các lớp tập huấn sử dụng dịch vụ công trực tuyến cho bà con khu vực Khóm 2, nhiều người lớn tuổi còn lúng túng.",
  },
  {
    author: "Trần Thị B",
    timeAgo: "5 giờ trước",
    likes: 3,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF3UFMfn4Z7WLShqjs4KEakEH_qXA3ppbmq4b7KOritX8Q1GocC9fXgPsA21kDeWpNeMOSsUFG5qNFCYm_wq28yHBaXkjGM4R1LoRquHmimnJdicF2xGUNN7jsZcpFtBGkwKtp7LRN5tiSdhjj8x_02ZEoHdAD7EnSkNtNyx30GwePwqruSmpTLw3EO7iPPQB8ubOgEtPxmdsGRqOJFApT2moOLZpb74Y9tMmviAmK7BcKgAkHrgSnLXMqpMd3S3Nx3m17VIIGOlm0",
    content:
      "Thông tin rất hữu ích. Đề nghị phường cập nhật thêm lịch hướng dẫn trực tiếp tại từng khóm để người dân tiện theo dõi.",
  },
];

export default function ArticleDetailContent({ id }: ArticleDetailContentProps) {
  return (
    <article className="w-full lg:w-[65%]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <span className="rounded bg-[#1f7a5a]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1f7a5a]">Tin tức xã hội</span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            UBND Phường Cao Lãnh tổ chức hội nghị triển khai công tác chuyển đổi số năm 2024
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              15 tháng 10 năm 2024
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">person</span>
              Ban Biên Tập
            </span>
            <span className="flex items-center gap-1.5 lg:ml-auto">
              <span className="material-symbols-outlined text-base">visibility</span>
              1,245 lượt xem
            </span>
          </div>
        </div>

        <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8qzrU7hnhsoDY94oufu7hJNCAl4vQEHEAdyibHV-GaB1BzqhGsucfbpVqjXB04TDYe1N7leVbGGm4IBXTVHh5Mp_KyqB1v4c3VSofSf563Peof9QqvE5CW2VcXCz2NUCpcD5w7r-k1nM4UsBIQp3B5AfhUhLPAxE_-VynmBPYJcVvLgwVJNCxqPhoQNE6Uq307xHjr73-vkeUHu1Bc3ov6ygiC9c00RUdsGPW_aGqtEqCUR8IGPw_TK7-88nKBTk2Qnt3qAoU43w7"
              alt="Hội nghị chuyển đổi số phường Cao Lãnh"
              fill
              className="object-cover"
              unoptimized
              sizes="(min-width: 1024px) 65vw, 100vw"
            />
          </div>
          <figcaption className="bg-slate-100 p-3 text-center text-sm italic text-slate-600">
            Toàn cảnh hội nghị triển khai công tác chuyển đổi số năm 2024 tại Hội trường UBND Phường Cao Lãnh.
          </figcaption>
        </figure>

        <div className="flex flex-wrap gap-3 py-1">
          <button className="flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1877F2]/90">
            <span className="material-symbols-outlined text-[20px]">share</span>
            Chia sẻ Facebook
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#0068FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0068FF]/90">
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Chia sẻ Zalo
          </button>
          <button className="ml-auto flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-300">
            <span className="material-symbols-outlined text-[20px]">link</span>
            Sao chép liên kết
          </button>
        </div>

        <div className="space-y-4 text-[17px] leading-relaxed text-slate-700">
          <p className="text-lg font-medium text-slate-900">
            Sáng ngày 15/10, tại hội trường UBND phường Cao Lãnh đã diễn ra hội nghị quan trọng nhằm định hướng và đẩy mạnh
            các hoạt động chuyển đổi số trên địa bàn phường trong năm 2024. Hội nghị có sự tham gia của các đồng chí lãnh đạo
            địa phương, đại diện các ban ngành, đoàn thể và đông đảo bà con nhân dân tiêu biểu.
          </p>
          <p>
            Phát biểu khai mạc hội nghị, đồng chí Chủ tịch UBND Phường nhấn mạnh tầm quan trọng của chuyển đổi số trong bối
            cảnh hiện nay. Đây không chỉ là xu thế tất yếu mà còn là yêu cầu cấp thiết để nâng cao hiệu lực, hiệu quả quản lý
            nhà nước, đồng thời mang lại những tiện ích thiết thực nhất cho người dân và doanh nghiệp trên địa bàn.
          </p>

          <h3 className="pt-2 text-2xl font-bold text-slate-900">Mục tiêu trọng tâm năm 2024</h3>
          <p>Kế hoạch chuyển đổi số năm 2024 của phường Cao Lãnh tập trung vào 3 trụ cột chính:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Chính quyền số:</strong> Phấn đấu 100% thủ tục hành chính đủ điều kiện được cung cấp dưới dạng dịch vụ
              công trực tuyến toàn trình; 90% hồ sơ công việc tại cấp phường được xử lý trên môi trường mạng.
            </li>
            <li>
              <strong>Kinh tế số:</strong> Hỗ trợ, hướng dẫn 100% các hộ kinh doanh cá thể trên địa bàn sử dụng thanh toán điện
              tử, không dùng tiền mặt.
            </li>
            <li>
              <strong>Xã hội số:</strong> Đẩy mạnh tuyên truyền, hướng dẫn người dân cài đặt và sử dụng các ứng dụng công dân
              số, định danh điện tử VNeID mức độ 2 đạt tỷ lệ trên 80% dân số trưởng thành.
            </li>
          </ul>

          <figure className="overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFm0JRe2fQd4evCnKLLptucmVYziq66tEFwbAAfo4Ap6KpVOjeMhtQFrp_vnjasNqkCbX0JHZ8Qog_gr5sWh0Q04Ss6a5riMUH5UyLXuB-CeT16aPb9H63Qv4FUrKhbFJGZ0V_3Embzg6wYkum1vlyWY66p-NUBnVyfdVE7qCoYHwN6jbiY3H9SIGQ3IPxS24nRLjo6TqBvxJyMIVPf3DhnbK6ypjyCVgGkwe_DI6Ky2EsmxMeV3KspqvwliG4SS3DT4Y2ogIGZj_M"
                alt="Cán bộ hướng dẫn người dân sử dụng dịch vụ công"
                fill
                className="object-cover"
                unoptimized
                sizes="(min-width: 1024px) 65vw, 100vw"
              />
            </div>
            <figcaption className="bg-slate-100 p-3 text-center text-sm italic text-slate-600">
              Đoàn thanh niên phường hướng dẫn người dân cài đặt và sử dụng ứng dụng VNeID.
            </figcaption>
          </figure>

          <p>
            Tại hội nghị, các đại biểu cũng đã nghe báo cáo tham luận từ các tổ công nghệ số cộng đồng khóm về những thuận
            lợi, khó khăn trong quá trình triển khai thực tế tại cơ sở. Nhiều ý kiến đóng góp thiết thực đã được ghi nhận để bổ
            sung vào kế hoạch hành động chi tiết.
          </p>
          <p>
            Kết luận hội nghị, lãnh đạo UBND phường yêu cầu các ngành, đoàn thể cần quyết liệt hơn nữa trong công tác chỉ đạo,
            điều hành; phân công nhiệm vụ cụ thể, rõ ràng; đồng thời tăng cường công tác kiểm tra, giám sát tiến độ thực hiện
            các chỉ tiêu chuyển đổi số đã đề ra.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-6">
          <span className="material-symbols-outlined text-slate-500">sell</span>
          <span className="text-sm font-medium text-slate-700">Từ khóa:</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href="/tin-tuc"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 border-t border-slate-200 py-8 sm:flex-row sm:items-center">
          <Link href="/tin-tuc" className="group flex items-center gap-3 sm:max-w-[45%]">
            <div className="flex size-10 items-center justify-center rounded-full border border-slate-300 transition-all group-hover:border-[#1f7a5a] group-hover:bg-[#1f7a5a] group-hover:text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-xs uppercase tracking-wider text-slate-500">Bài trước</span>
              <span className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Thông báo lịch tiếp công dân tháng 11/2024
              </span>
            </div>
          </Link>

          <Link href="/tin-tuc" className="group flex items-center justify-end gap-3 text-right sm:max-w-[45%]">
            <div className="flex flex-col">
              <span className="mb-1 text-xs uppercase tracking-wider text-slate-500">Bài tiếp theo</span>
              <span className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Ra quân dọn dẹp vệ sinh môi trường tuyến đường kiểu mẫu
              </span>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-slate-300 transition-all group-hover:border-[#1f7a5a] group-hover:bg-[#1f7a5a] group-hover:text-white">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </Link>
        </div>

        <section className="mt-2">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">forum</span>
            Bình luận ({comments.length})
          </h3>

          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200">
                <span className="material-symbols-outlined text-slate-500">person</span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <textarea
                  className="min-h-[100px] w-full resize-y rounded-lg border-slate-300 bg-slate-50 text-sm focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
                  placeholder="Nhập ý kiến đóng góp của bạn..."
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Vui lòng đăng nhập để bình luận</span>
                  <button className="rounded-lg bg-[#1f7a5a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#196448]">
                    Gửi bình luận
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={`${comment.author}-${comment.timeAgo}`} className="flex gap-4">
                <Image
                  src={comment.avatar}
                  alt={`Avatar ${comment.author}`}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="rounded-2xl rounded-tl-none bg-slate-100 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{comment.author}</h4>
                      <span className="text-xs text-slate-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                  </div>
                  <div className="ml-2 mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                    <button className="transition-colors hover:text-[#1f7a5a]">Thích ({comment.likes})</button>
                    <button className="transition-colors hover:text-[#1f7a5a]">Phản hồi</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-400">Mã bài viết: {id}</p>
      </div>
    </article>
  );
}
