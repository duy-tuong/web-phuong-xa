type DichVuDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DichVuDetailPage({ params }: DichVuDetailPageProps) {
  const { id } = await params;

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Chi tiet dich vu cong</h2>
      <p className="text-slate-600">Dang xem dich vu co id: {id}</p>
    </section>
  );
}
