import api from "@/services/api";
import { adaptArticle } from "@/services/articles/mappers";
import type {
  ApiArticleDetail,
  ApiArticlesResponse,
  ApiCategory,
} from "@/services/articles/types";
import type { Article } from "@/types/article";

async function requestArticlesFromApi() {
  const response = await api.get<ApiArticlesResponse>("/articles", {
    params: {
      page: 1,
      pageSize: 50,
    },
  });

  const rows = Array.isArray(response.data?.data) ? response.data.data : [];
  return rows.map(adaptArticle);
}

export async function getArticles(): Promise<Article[]> {
  try {
    return await requestArticlesFromApi();
  } catch (error) {
    console.error("Không thể tải danh sách bài viết:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await requestArticlesFromApi();
    const article = articles.find((item) => item.slug === slug);

    if (!article) {
      return null;
    }

    if (!article.id) {
      return article;
    }

    try {
      const detailResponse = await api.get<ApiArticleDetail>(`/articles/${article.id}`);
      return adaptArticle(detailResponse.data);
    } catch (detailError) {
      console.error(`Không thể tải chi tiết bài viết slug=${slug}:`, detailError);
      return article;
    }
  } catch (error) {
    console.error(`Không thể tải bài viết slug=${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await api.get<ApiCategory[]>("/categories");
    const categories = Array.isArray(response.data)
      ? response.data
          .map((category) => category.name?.trim())
          .filter((name): name is string => Boolean(name))
      : [];

    if (categories.length > 0) {
      return ["Tất cả", ...categories];
    }

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : ["Tất cả"];
  } catch (error) {
    console.error("Không thể tải danh mục bài viết:", error);

    const articles = await getArticles();
    const derived = Array.from(new Set(articles.map((article) => article.category)));
    return derived.length > 0 ? ["Tất cả", ...derived] : ["Tất cả"];
  }
}
