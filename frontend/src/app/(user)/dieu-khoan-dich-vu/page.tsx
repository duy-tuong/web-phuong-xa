import Link from "next/link";

const sections = [
  {
    title: "1. Phạm vi áp dụng",
    body: "Điều khoản này áp dụng cho tất cả người dùng truy cập và sử dụng dịch vụ trực tuyến trên Cổng thông tin điện tử Phường Cao Lãnh, bao gồm tra cứu thông tin, nộp hồ sơ, tải biểu mẫu và tương tác qua kênh liên hệ.",
  },
  {
    title: "2. Chấp nhận điều khoản",
    body: "Khi tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý với các quy định tại đây. Trường hợp không đồng ý, vui lòng dừng việc sử dụng hệ thống.",
  },
  {
    title: "3. Tài khoản và bảo mật",
    body: "Người dùng chịu trách nhiệm giữ kín thông tin đăng nhập của mình. Mọi hành vi sử dụng tài khoản phát sinh từ thiết bị của bạn được xem là hành vi do bạn thực hiện, trừ khi có thông báo mất tài khoản từ bạn tới cơ quan quản trị.",
  },
  {
    title: "4. Nội dung và tài liệu nộp lên",
    body: "Tài liệu, thông tin cung cấp phải chính xác, rõ ràng và hợp lệ. Hệ thống có thể từ chối hồ sơ nếu phát hiện thông tin sai lệch, thiếu hoặc vi phạm quy định pháp luật.",
  },
  {
    title: "5. Giới hạn trách nhiệm",
    body: "Chúng tôi cố gắng đảm bảo hệ thống hoạt động ổn định, tuy nhiên không cam kết tuyệt đối về tính liên tục, không lỗi hoặc không bị gián đoạn do các yếu tố ngoài ý muốn (bảo trì, sự cố mạng, thiên tai).",
  },
  {
    title: "6. Sở hữu trí tuệ",
    body: "Nội dung, thiết kế, và tài nguyên trên cổng thông tin thuộc quyền sở hữu của UBND Phường Cao Lãnh và các bên liên quan. Cấm sao chép, phát tán khi chưa được chấp thuận bằng văn bản.",
  },
  {
    title: "7. Thay đổi điều khoản",
    body: "Chúng tôi có quyền cập nhật điều khoản khi cần thiết. Thông tin cập nhật sẽ được công bố tại trang này. Việc tiếp tục sử dụng đồng nghĩa với việc chấp nhận các thay đổi đó.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18),transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Phường Cao Lãnh
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Điều khoản dịch vụ
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Vui lòng đọc kỹ để sử dụng các dịch vụ công một cách an toàn và
              minh bạch.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                Trang thông tin điện tử
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-600">
                Hồ sơ trực tuyến
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                Dịch vụ công
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {sections.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Bạn cần hỗ trợ?
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Nếu cần giải đáp thêm về điều khoản hoặc quy trình nộp hồ sơ,
                vui lòng liên hệ bộ phận một cửa.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>Hotline: 0277 3851 234</p>
                <p>Email: phuongcaolanh@dongthap.gov.vn</p>
              </div>
              <Link
                href="/lien-he"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Gửi câu hỏi
              </Link>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h3 className="text-base font-semibold text-emerald-800">
                Gợi ý sử dụng
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                <li>Chuẩn bị bản scan rõ ràng trước khi tải lên.</li>
                <li>Kiểm tra thông tin cá nhân trước khi nộp hồ sơ.</li>
                <li>Lưu lại mã hồ sơ để theo dõi trạng thái xử lý.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Tài liệu liên quan
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link
                    className="text-emerald-700 hover:underline"
                    href="/chinh-sach-bao-mat"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-emerald-700 hover:underline"
                    href="/dich-vu"
                  >
                    Danh mục dịch vụ công
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
