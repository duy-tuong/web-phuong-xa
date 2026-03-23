import Image from "next/image";

export default function IntroSection() {
  return (
    <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12" id="general-intro">
      <div>
        <h2 className="mb-6 text-3xl font-bold text-[#111816]">Về chúng tôi</h2>
        <p className="mb-6 text-lg leading-relaxed text-[#111816]">
          Phường Cao Lãnh chính thức được thành lập ngày <strong>01 tháng 7 năm 2025</strong>, trên cơ sở sáp nhập 9 đơn vị hành chính cũ gồm Phường 1, 3, 4, 6, Phường Hòa Thuận, Xã Hòa An, Xã Tịnh Thới, Xã Tân Thuận Tây và Xã Tân Thuận Đông — là phường trung tâm của Thành phố Cao Lãnh, tỉnh Đồng Tháp.
        </p>
        <p className="text-lg leading-relaxed text-[#111816]">
          Với diện tích <strong>73,33 km²</strong> và dân số <strong>137.387 người</strong>, mật độ 1.874 người/km², Phường Cao Lãnh không ngừng vươn lên, hướng tới xây dựng đô thị văn minh — sáng, xanh, sạch, đẹp trong thời kỳ chuyển đổi số.
        </p>
      </div>

      <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXQBE5bW9BZ0RhuT5K6xI6SG6t1GsZOFkVzEENHYq4aggIWFvCbyyaLtZgun_zejt2oW0sQP_GEp9CZBgy5RN0XP-_pNBcpbYjmmBQcP9U9HC-dTjQBakUAIVuMqj5IFcVxHvFzXCkP2Nhz9hXp4bTYzwvdzT_5j8NYVNJmxaFLKNTtktVNTSRc7OowdtZON8I0xEboVGdYLb50aKE6F_PpP1rmaEEsJ5RJ53XDJk3LO2jJrbHa4n3maYlX6zwHS-DHs4ib8dxP3QX"
            alt="Hình ảnh đời sống cộng đồng Phường Cao Lãnh"
            fill
            className="object-cover"
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="absolute -bottom-5 -right-2 hidden rounded-xl border border-[#e5edea] bg-white p-4 shadow-lg sm:block md:-right-5">
          <p className="font-bold text-[#111816]">Thành lập 01/07/2025</p>
          <p className="text-sm text-[#5f8c7f]">Hợp nhất từ 9 đơn vị hành chính</p>
        </div>
      </div>
    </section>
  );
}
