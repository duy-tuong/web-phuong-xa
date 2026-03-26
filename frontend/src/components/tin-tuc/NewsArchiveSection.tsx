import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/types/article";

type NewsArchiveSectionProps = {
  articles: Article[];
};

export default function NewsArchiveSection({ articles }: NewsArchiveSectionProps) {
  const newsCards = articles.slice(1).map((article) => ({
    slug: article.slug,
    title: article.title,
    image: article.heroImage,
    date: article.date,
    summary: article.bodyLead,
    category: article.category,
  }));

  if (newsCards.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Kho tin tuc</h2>
        <p className="text-sm text-slate-500">{newsCards.length} bai viet con lai</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsCards.map((card) => (
          <ArticleCard key={card.slug} {...card} />
        ))}
      </div>
    </section>
  );
}
