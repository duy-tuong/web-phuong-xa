import Image from "next/image";

const borderDirections = [
  { label: "Phía Bắc", value: "Giáp phường Mỹ Phú" },
  { label: "Phía Nam", value: "Giáp xã Hòa An" },
  { label: "Phía Đông", value: "Giáp Phường 1 và Phường 2" },
  { label: "Phía Tây", value: "Giáp xã Tịnh Thới và sông Tiền" },
];

export default function GeographySection() {
  return (
    <section className="border-t border-[#e5edea] pt-10 md:pt-12" id="geography">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="order-2 md:order-1">
          <div className="relative h-[280px] w-full overflow-hidden rounded-xl bg-[#f0f5f3] p-2 sm:h-[320px] md:h-[350px]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9IpOORs7W3iaI33EtsQZOfXPGbLiwMo_brnn9nuQ9Ia8jiBl-z0PKjHzYOkrhLJtce1ike4BqGm59J1thbJu7gbe9OZCmX8tT7L5ZP9FFlCraXO2fvf4ArWjnkDz9hvsjKwsOzs_spuO7MRTlDw2DTSDzZAy_OCrGFZqPIs5v1O_9UwI-rV9hvUeD8ZaemVvJiaIoVLUYA6IAreRrs8M0fbDb5KpXnJ_YNHJyOnYY4Jr-tTQQno2O6HrjHfaZkuRiUgIzm5QhlBx8"
              alt="Bản đồ địa giới hành chính Phường Cao Lãnh"
              fill
              className="rounded-lg object-cover"
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute right-4 top-4 rounded bg-white px-3 py-2 text-sm font-medium text-[#111816] shadow">
              Bản đồ địa giới
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h2 className="mb-6 text-3xl font-bold text-[#111816]">Vị trí Địa lý</h2>
          <p className="mb-4 text-lg leading-relaxed text-[#111816]">
            Nằm ở vị trí trung tâm của Thành phố Cao Lãnh, phường sở hữu mạng lưới giao thông thủy bộ thuận lợi,
            dễ dàng kết nối với các khu vực lân cận.
          </p>
          <ul className="mt-6 space-y-3 text-base text-[#111816]">
            {borderDirections.map((direction) => (
              <li key={direction.label} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1f7a5a]" />
                <div>
                  <strong>{direction.label}:</strong> {direction.value}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
