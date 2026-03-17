import Link from "next/link";

export default function DichVuHanhChinhPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Dich vu hanh chinh</h2>
      <p className="text-slate-600">Trang tong quan dich vu hanh chinh de dan huong nguoi dung.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/dich-vu-hc/nop-ho-so" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900">
          Nop ho so truc tuyen
        </Link>
        <Link href="/dich-vu-hc/tra-cuu" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900">
          Tra cuu ho so
        </Link>
        <Link href="/dich-vu-hc/1" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900">
          Chi tiet dich vu mau
        </Link>
      </div>
    </section>
  );
}
