import Image from "next/image";

const infrastructureCards = [
  {
    title: "Giáo dục",
    description: "Hệ thống trường học các cấp đạt chuẩn quốc gia.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqsetsB7cEzSkO9WIDbA_LiijJnigAkGwFNEpGyKuUHhoRkt6sFLSh7g_TrVR-XNl6pBvIXg1ii_DTSLxPkx_BTLxt6ihsredsFrBAavnVFzDmm-cpstdTQxoQrU8RRkWYCq0uy-0bHGk7kpfmUK5R-9eJa_qcIAHm6OvnkMeAZwKUd2O1RJP3pUDhhs0Ww6jV9_hrCDMOpGC2lGwChXTbsWBffgYEQo3wS2birfw4VQleJpIsTo9sPTrCm6USmu0hCFKVf4fvcI6L",
  },
  {
    title: "Y tế",
    description: "Trạm y tế hiện đại, chăm sóc sức khỏe ban đầu tốt.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACLwEmmGWPtKlSiOv221aOIaCVe36ZkNOIwDD5MMMxHsgp54D6ChXOYkrvjGLbNjW9yl0mQXMDWcVGO6EEPctJqGvmoZq1-d0GCFU906nDP6VLQrlCDCAociOVEkhcNC5YYfX4CzsiD1Gq3nUNC1OeLIdakHB4vYwO2gmmRqykiukUA2tT7G0nAWVK9oI24wQwRCgq5xeMCnMs9owunucXfx1lj1YODGV7N6OelRNqq2k1t3m_zXe4Xj4G5AOzlXFWUQIYEGvjOLcG",
  },
  {
    title: "Giao thông",
    description: "100% đường nội ô được thảm nhựa, chiếu sáng đô thị.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsT0j88yhiel0E2W8OJ_mWgAUY2hyUvTOGOt-u4y9dEzJsaepzzmxCywrf7qPg0Dp7QJeigC0VW7Zj_ur4th0A24xaQh8fq6Y7JdmFiypS1g6oYDCbcQgsylXRWa7KxrWkXCEuaF6a0rpNXL4uCYNxYv_SrHi_Dk-E2Xb-2BACISCAy1o7lcutt3xZyShzByBKadD9iEwkENSZ0L4f2DHoGh2RBbeXIy-qsyKRfzdPy7yKByJvptLKf9bW2-c3ep3CNluoVxoNco82",
  },
  {
    title: "Tiện ích",
    description: "Phủ sóng WiFi công cộng, công viên và chợ khang trang.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjlP421RKhLGtiACXMyF8UIfkrv7t6DRBQlbiE-DmgyuBMXhL1ygGHwW58pCHlolKuoUw9kqNaoDCCjAuUYINKJ3u-pjRl6BhtPXrma11kd2SxCYdmAV28khWqzg1HAG6Vunwu01yDQnp3RJUAhYY9znT8gyxeaWyXcYmn2meOJ9JVNE_aMOHO8ekVc4soAGX_ljg5gcLGUfODs3EePUtWZLtA4dP1oKHRiLna4cfShqMbXElmR-uUK6uHe3wcTY8qqnWPsV02P78i",
  },
];

export default function InfrastructureSection() {
  return (
    <section className="border-t border-[#e5edea] pt-10 md:pt-12" id="infrastructure">
      <h2 className="mb-10 text-center text-3xl font-bold text-[#111816]">Cơ sở Hạ tầng</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {infrastructureCards.map((item) => (
          <article key={item.title} className="group cursor-pointer">
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
            </div>
            <h3 className="text-lg font-bold text-[#111816]">{item.title}</h3>
            <p className="mt-1 text-sm text-[#5f8c7f]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
