const faqs = [
  {
    question: "Thủ tục hành chính làm ở đâu?",
    answer:
      "Bạn có thể thực hiện thủ tục hành chính trực tiếp tại Bộ phận Một cửa của UBND Phường Cao Lãnh hoặc nộp hồ sơ trực tuyến qua Cổng Dịch vụ công Quốc gia đối với các thủ tục có hỗ trợ.",
  },
  {
    question: "Lịch tiếp công dân của lãnh đạo như thế nào?",
    answer:
      "Chủ tịch UBND phường tiếp công dân định kỳ vào sáng thứ 5 hàng tuần. Ngoài ra, cán bộ tiếp dân làm việc trong các ngày làm việc hành chính từ thứ 2 đến thứ 6.",
  },
  {
    question: "Thời gian xử lý phản ánh, kiến nghị là bao lâu?",
    answer:
      "Thời gian xử lý thông thường từ 3 - 5 ngày làm việc tùy thuộc vào tính chất phức tạp của phản ánh, kiến nghị. Chúng tôi sẽ phản hồi qua email hoặc số điện thoại bạn cung cấp.",
  },
];

export default function FaqSection() {
  return (
    <div className="mx-auto mb-16 max-w-3xl">
      <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Các câu hỏi thường gặp</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm group">
            <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50 focus:outline-none">
              <span className="font-semibold text-slate-900">{faq.question}</span>
              <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-6 pb-4 text-sm text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
