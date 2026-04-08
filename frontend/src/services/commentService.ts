//* Bình luận về bài viết, bao gồm hàm lấy bình luận và hàm gửi bình luận mới
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
   //!Đổi Slug lấy ID.hàm getArticleBySlug đi dò xem bài viết này mang ID số mấy.
    const article = await getArticleBySlug(slug);
   //! Nếu dò không ra bài viết, lập tức trả về mảng rỗng [] để UI không bị vỡ sập.
    if (!article?.id) {
      return [];
    }
//! Gọi API và Phiên dịch. Có ID rồi thì gọi API lấy bình luận. Sau đó ném qua máy "adaptComment" để chuẩn hóa tên biến cho UI.
    const response = await api.get<ApiComment[]>(`/comments/article/${article.id}`);
    return Array.isArray(response.data) ? response.data.map(adaptComment) : [];
  } catch (error) {
    console.error(`Không thể tải bình luận cho bài viết slug=${slug}:`, error);
    return [];
  }
}

export async function submitCommentByArticleSlug(input: SubmitCommentInput): Promise<void> {
  //! Phải có ID bài viết thì mới biết gửi bình luận này nhét vào bài nào trong Database.
  const article = await getArticleBySlug(input.slug);
  if (!article?.id) {
    throw new Error("Không tìm thấy bài viết để gửi bình luận");
  }
//! Dùng .trim() để gọt sạch khoảng trắng dư thừa do người dùng lỡ bấm dấu cách, tránh việc gửi lên database những bình luận trống rỗng
  await api.post("/comments", {
    articleId: article.id,
    userName: input.userName.trim(),
    content: input.content.trim(),
  });
}
