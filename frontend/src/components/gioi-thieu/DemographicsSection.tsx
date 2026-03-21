import AnimatedNumber from "@/components/ui/AnimatedNumber";

const demographicCards = [
  {
    label: "Dân số",
    value: "137.387",
    hint: "Người · Mật độ 1.874 người/km²",
    className: "from-[#1f7a5a]/10 to-[#1f7a5a]/5 border-[#1f7a5a]/20",
    textColor: "text-[#1f7a5a]",
  },
  {
    label: "Diện tích",
    value: "73",
    hint: "km² (7.333 ha)",
    className: "from-blue-50 to-blue-100/50 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    label: "Doanh nghiệp",
    value: "1.734",
    hint: "& 16.912 hộ kinh doanh (2024)",
    className: "from-amber-50 to-amber-100/50 border-amber-200",
    textColor: "text-amber-700",
  },
  {
    label: "Cơ sở Y tế",
    value: "4",
    hint: "Bệnh viện + 1 Trung tâm y tế + 100+ nhà thuốc",
    className: "from-pink-50 to-pink-100/50 border-pink-200",
    textColor: "text-pink-700",
  },
];

export default function DemographicsSection() {
  return (
    <section id="demographics">
      <h2 className="mb-10 text-center text-3xl font-bold text-[#111816]">Thống kê & Cơ cấu</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {demographicCards.map((card) => (
          <article
            key={card.label}
            className={`rounded-2xl border bg-gradient-to-br p-6 text-center sm:p-8 ${card.className}`}
          >
            <h3 className="mb-1 text-base font-semibold text-slate-500">{card.label}</h3>
            <p className={`mb-2 text-4xl font-black sm:text-5xl ${card.textColor}`}>
              <AnimatedNumber value={card.value} />
            </p>
            <p className="text-xs font-medium leading-relaxed text-slate-500">{card.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
