export interface ArticleSectionBullet {
  label: string;
  text: string;
}

export interface Article {
  id?: number;
  isFeatured?: boolean;
  hasRealImage?: boolean;
  contentHtml?: string;
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  date: string;
  author: string;
  authorId: string;
  status: string;
  publishedAt: string;
  views: string;
  heroImage?: string;
  heroCaption: string;
  bodyLead: string;
  bodyParagraphs: string[];
  sectionTitle: string;
  sectionIntro: string;
  sectionBullets: ArticleSectionBullet[];
  subImage?: string;
  subCaption: string;
  tags: string[];
}

export interface ArticleCardProps {
  slug: string;
  title: string;
  image?: string;
  date: string;
  summary: string;
  category?: string;
  layout?: "vertical" | "horizontal";
}
