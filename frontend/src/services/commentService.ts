// Bình luận được lấy từ API, có xử lý fallback khi API không trả về dữ liệu hợp lệ hoặc gặp lỗi
import api from "@/services/api";
import { getArticleBySlug } from "@/services/articleService";
import type { Comment } from "@/types/comment";

type ApiComment = {
  id: number;
  userName: string;
  content: string;
  createdAt: string;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const fallbackComments: Comment[] = [
  {
    name: "Nguyễn Văn A",
    timeAgo: "2 giờ trước",
    likes: 5,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBpZrj2eP_b6pIV1lIkEIrS9YLnZha8pV5HQrx1Z7WoOiGX4Uy77lJvH2G9Jpp-xSwHy6bjnuHxbngbfiC78dacLbFc_52VHIW6_w3ZzJV1EMSLzGzi92Qxg2U3eDlwVmObaeOkyhfCBjrOjDNaEJ9eLf0FsBphxQWWV9anhwF9IuUP2INw5u_cYCYZW2HK2Aop2Wqvh33ZQzq0w3owSKipR5WaTQ-UXw-_0BwpAmCiMR5e3guZ6I8vMf2sl0NLy6QLZKD57mCH1qD",
    content:
      "Rất mong phường sớm triển khai các lớp tập huấn sử dụng dịch vụ công trực tuyến cho bà con khu vực Khóm 2, nhiều người lớn tuổi còn lúng túng.",
  },
];

function formatTimeAgo(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.max(1, Math.floor((Date.now() - createdTime) / 60000));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

function adaptComment(comment: ApiComment): Comment {
  return {
    name: comment.userName,
    timeAgo: formatTimeAgo(comment.createdAt),
    likes: 0,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBpZrj2eP_b6pIV1lIkEIrS9YLnZha8pV5HQrx1Z7WoOiGX4Uy77lJvH2G9Jpp-xSwHy6bjnuHxbngbfiC78dacLbFc_52VHIW6_w3ZzJV1EMSLzGzi92Qxg2U3eDlwVmObaeOkyhfCBjrOjDNaEJ9eLf0FsBphxQWWV9anhwF9IuUP2INw5u_cYCYZW2HK2Aop2Wqvh33ZQzq0w3owSKipR5WaTQ-UXw-_0BwpAmCiMR5e3guZ6I8vMf2sl0NLy6QLZKD57mCH1qD",
    content: comment.content,
  };
}

type SubmitCommentInput = {
  slug: string;
  userName: string;
  content: string;
};

export async function getCommentsByArticleId(slug: string): Promise<Comment[]> {
  try {
    const article = await getArticleBySlug(slug);
    if (!article?.id) {
      return isDevelopment ? fallbackComments : [];
    }

    const response = await api.get<ApiComment[]>(`/comments/article/${article.id}`);
    const comments = Array.isArray(response.data) ? response.data.map(adaptComment) : [];
    return comments;
  } catch (error) {
    console.error(`Không thể tải bình luận cho bài viết slug=${slug}:`, error);
    return isDevelopment ? fallbackComments : [];
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
