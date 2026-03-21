type TinTucDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TinTucDetailPage({ params }: TinTucDetailPageProps) {
  const { id } = await params;

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Chi tiet tin tuc</h2>
      <p className="text-slate-600">Dang xem bai viet co id: {id}</p>
    </section>
  );
}
