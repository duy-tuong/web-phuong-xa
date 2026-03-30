import api from "@/services/api";
import { buildExcerpt } from "@/lib/html-utils";
import { toArticle } from "@/services/admin/contentMappers";
import { toBackendArticleStatus } from "@/services/admin/status";
import type {
  ApiArticle,
  ArticlePayload,
  LegacyCollectionResponse,
} from "@/services/admin/types";
import type { Article } from "@/types";

export async function fetchAdminArticles(): Promise<Article[]> {
  const response = await api.get<ApiArticle[] | LegacyCollectionResponse<ApiArticle>>("/articles/admin");
  const rows = Array.isArray(response.data) ? response.data : response.data?.value ?? [];
  return rows.map(toArticle);
}

export async function createAdminArticle(payload: ArticlePayload): Promise<void> {
  await api.post("/articles", {
    title: payload.title.trim(),
    slug: payload.slug?.trim() || null,
    excerpt: payload.excerpt?.trim() || buildExcerpt(payload.content),
    featuredImage: payload.featuredImage?.trim() || null,
    content: payload.content,
    categoryId: Number(payload.categoryId),
    status: toBackendArticleStatus(payload.status),
  });
}

export async function updateAdminArticle(id: string, payload: ArticlePayload): Promise<void> {
  await api.put(`/articles/${id}`, {
    title: payload.title.trim(),
    slug: payload.slug?.trim() || null,
    excerpt: payload.excerpt?.trim() || buildExcerpt(payload.content),
    featuredImage: payload.featuredImage?.trim() || null,
    content: payload.content,
    categoryId: Number(payload.categoryId),
    status: toBackendArticleStatus(payload.status),
  });
}

export async function deleteAdminArticle(id: string): Promise<void> {
  await api.delete(`/articles/${id}`);
}
