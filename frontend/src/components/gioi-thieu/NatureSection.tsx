const natureItems = [
  {
    title: "Khí hậu",
    description:
      "Nhiệt đới gió mùa, ôn hòa quanh năm, đặc trưng vùng Đồng bằng sông Cửu Long, chia thành hai mùa mưa nắng rõ rệt.",
  },
  {
    title: "Sông ngòi",
    description:
      "Hệ thống kênh rạch chằng chịt, được bao bọc bởi nhánh sông Tiền hiền hòa, cung cấp nguồn nước dồi dào và phù sa màu mỡ.",
  },
  {
    title: "Sinh thái",
    description:
      "Hệ sinh thái phong phú với nhiều mảng xanh đô thị, vườn cây ăn trái xen kẽ, mang lại không gian sống trong lành, tươi mát.",
  },
];

export default function NatureSection() {
  return (
    <section className="bg-[#f0f5f3] py-12 sm:py-16" id="nature">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-[#111816]">Điều kiện Tự nhiên</h2>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {natureItems.map((item) => (
            <article
              key={item.title}
              className="rounded-xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-bold text-[#111816]">{item.title}</h3>
              <p className="text-[#5f8c7f]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
