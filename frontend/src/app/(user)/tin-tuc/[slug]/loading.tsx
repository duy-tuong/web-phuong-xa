export default function TinTucLoading() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-5 w-80 animate-pulse rounded bg-slate-200" />
      <div className="flex flex-col gap-10 lg:flex-row">
        <section className="w-full space-y-6 lg:w-[65%]">
          <div className="h-8 w-11/12 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200" />
        </section>
        <aside className="w-full space-y-6 lg:w-[35%]">
          <div className="h-48 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-56 w-full animate-pulse rounded-xl bg-slate-200" />
        </aside>
      </div>
    </main>
  );
}
