export default function NopHoSoPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Nop ho so truc tuyen</h2>
      <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Ho va ten" />
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="So dien thoai" />
        <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={4} placeholder="Noi dung ho so" />
        <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
          Gui ho so
        </button>
      </form>
    </section>
  );
}
