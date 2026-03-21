import Link from "next/link";

const mockNews = [
  { id: "1", title: "Thong bao lich tiep dan tuan nay" },
  { id: "2", title: "Cap nhat tien do ho so truc tuyen" },
  { id: "3", title: "Su kien van hoa tai phuong" },
];

export default function TinTucListPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Tin tuc va su kien</h2>
      <div className="space-y-3">
        {mockNews.map((item) => (
          <Link
            key={item.id}
            href={`/tin-tuc/${item.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-cyan-600"
          >
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-500">/tin-tuc/{item.id}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
