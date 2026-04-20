import Link from "next/link";

const privacySections = [
  {
    title: "1. Thông tin chung",
    body: "Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng khi truy cập Cổng thông tin điện tử Phường Cao Lãnh. Mục tiêu của chúng tôi là đảm bảo tính minh bạch, an toàn và quyền riêng tư cho mọi cá nhân khi sử dụng dịch vụ trực tuyến.",
  },
  {
    title: "2. Thông tin được thu thập",
    body: "Bao gồm thông tin cơ bản (họ tên, số điện thoại, email), thông tin hồ sơ nộp trực tuyến, và dữ liệu kỹ thuật (địa chỉ IP, thiết bị, lịch sử truy cập) để cải thiện chất lượng dịch vụ.",
  },
  {
    title: "3. Mục đích sử dụng",
    body: "Thông tin được sử dụng để xác minh danh tính, liên hệ hỗ trợ, xử lý hồ sơ, cải thiện trải nghiệm người dùng và đáp ứng các yêu cầu pháp lý liên quan.",
  },
  {
    title: "4. Chia sẻ thông tin",
    body: "Chúng tôi không chia sẻ thông tin cá nhân cho bên thứ ba, trừ trường hợp bắt buộc theo quy định pháp luật hoặc được người dùng đồng ý rõ ràng.",
  },
  {
    title: "5. Lưu trữ và bảo vệ",
    body: "Dữ liệu được lưu trữ trên hệ thống bảo mật, áp dụng các biện pháp kỹ thuật và quản trị để hạn chế truy cập trái phép, mất mát hoặc sai lệch thông tin.",
  },
  {
    title: "6. Quyền của người dùng",
    body: "Bạn có quyền kiểm tra, cập nhật, yêu cầu chỉnh sửa hoặc xóa thông tin theo quy định. Vui lòng liên hệ bộ phận hỗ trợ nếu cần thực hiện các quyền này.",
  },
  {
    title: "7. Cookie và phân tích",
    body: "Hệ thống có thể sử dụng cookie để lưu tùy chọn truy cập và thống kê lượt truy cập. Bạn có thể tùy chỉnh trình duyệt để từ chối cookie, tuy nhiên một số tính năng có thể bị hạn chế.",
  },
  {
    title: "8. Cập nhật chính sách",
    body: "Chính sách bảo mật có thể được cập nhật định kỳ. Khi có thay đổi quan trọng, chúng tôi sẽ thông báo trên trang này.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Bảo vệ dữ liệu người dùng
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Chính sách bảo mật
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Chúng tôi cam kết minh bạch trong việc thu thập, sử dụng và lưu trữ dữ liệu. Đồng thời, chúng tôi luôn đặt ưu tiên hàng đầu vào việc bảo vệ quyền riêng tư của người dùng/công dân, đảm bảo thông tin cá nhân được an toàn và chỉ sử dụng cho mục đích hợp pháp.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            {privacySections.map((item) => (
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
                Điểm liên hệ bảo mật
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Nếu phát hiện rủi ro bảo mật hoặc cần hỗ trợ về quyền dữ liệu,
      vui lòng liên hệ trực tiếp bộ phận một cửa.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>Địa chỉ: Số 03, Đường 30/4, Phường Cao Lãnh</p>
                <p>Email: phuongcaolanh@dongthap.gov.vn</p>
              </div>
              <Link
                href="/lien-he"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
              <h3 className="text-base font-semibold text-blue-800">
                Cam kết của chúng tôi
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-800">
                <li>Không bàn giao dữ liệu cá nhân cho bên thứ ba.</li>
                <li>
                  Lưu trữ an toàn và chỉ được truy cập bởi nhân sự được ủy
        quyền.
                </li>
                <li>Thông báo kịp thời nếu có sự cố ảnh hưởng đến dữ liệu.</li>
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
                    href="/dieu-khoan-dich-vu"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-emerald-700 hover:underline"
                    href="/dich-vu"
                  >
                    Các thủ tục hành chính
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
