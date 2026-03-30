import api from "@/services/api";
import { getArticleBySlug } from "@/services/articleService";
import { adaptComment } from "@/services/comments/helpers";
import {
  type ApiComment,
  type SubmitCommentInput,
} from "@/services/comments/types";
import type { Comment } from "@/types/comment";

export async function getCommentsByArticleId(slug: string): Promise<Comment[]> {
  try {
    const article = await getArticleBySlug(slug);
    if (!article?.id) {
      return [];
    }

    const response = await api.get<ApiComment[]>(`/comments/article/${article.id}`);
    return Array.isArray(response.data) ? response.data.map(adaptComment) : [];
  } catch (error) {
    console.error(`Không thể tải bình luận cho bài viết slug=${slug}:`, error);
    return [];
  }
}

export async function submitCommentByArticleSlug(input: SubmitCommentInput): Promise<void> {
  const article = await getArticleBySlug(input.slug);
  if (!article?.id) {
    throw new Error("Không tìm thấy bài viết để gửi bình luận");
  }

  await api.post("/comments", {
    articleId: article.id,
    userName: input.userName.trim(),
    content: input.content.trim(),
  });
}
