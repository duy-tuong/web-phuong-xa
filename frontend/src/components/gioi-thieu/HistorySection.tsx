const historyItems = [
  {
    year: "1983",
    title: "Thành lập",
    description:
      "Chính thức được thành lập và đi vào hoạt động, đánh dấu bước ngoặt quan trọng trong công tác quản lý hành chính địa phương.",
  },
  {
    year: "2005",
    title: "Đô thị hóa",
    description:
      "Bắt đầu quá trình nâng cấp cơ sở hạ tầng, mở rộng các tuyến đường chính và quy hoạch lại các khu dân cư tập trung.",
  },
  {
    year: "Hiện nay",
    title: "Phát triển bền vững",
    description:
      "Đạt chuẩn phường văn minh đô thị, tập trung phát triển kinh tế dịch vụ, thương mại đi đôi với bảo vệ môi trường.",
  },
];

export default function HistorySection() {
  return (
    <section className="pt-8 md:pt-10" id="history">
      <h2 className="mb-10 text-center text-3xl font-bold text-[#111816]">Lịch sử hình thành & phát triển</h2>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-3 top-0 h-full w-px bg-slate-300 sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-10 sm:space-y-12">
          {historyItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <article
                key={item.year}
                className={`relative flex items-start gap-4 sm:items-center sm:justify-between ${
                  isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div className={`w-full pl-8 sm:w-5/12 sm:pl-0 ${isEven ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                  <h3 className="text-xl font-bold text-[#111816]">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#5f8c7f]">{item.description}</p>
                </div>

                <div className="absolute left-3 top-1 h-7 w-7 -translate-x-1/2 rounded-full border-4 border-[#1f7a5a] bg-white sm:left-1/2 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2" />

                <div className={`hidden sm:block sm:w-5/12 ${isEven ? "sm:pl-8" : "sm:pr-8 sm:text-right"}`}>
                  <span className="text-2xl font-black text-[#1f7a5a]/50">{item.year}</span>
                </div>

                <span className="pl-8 text-sm font-black uppercase tracking-wide text-[#1f7a5a]/80 sm:hidden">
                  {item.year}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
