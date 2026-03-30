export type ApiArticlesResponse = {
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  data?: ApiArticleListItem[];
};

export type ApiArticleListItem = {
  id: number;
  title: string;
  slug: string;
  isFeatured?: boolean;
  featured?: boolean;
  IsFeatured?: boolean;
  excerpt?: string | null;
  featuredImage?: string | null;
  createdAt?: string | null;
  category?: string | null;
  author?: string | null;
};

export type ApiArticleDetail = ApiArticleListItem & {
  content?: string | null;
};

export type ApiCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
};
