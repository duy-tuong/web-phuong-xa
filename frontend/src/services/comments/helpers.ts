import type { ApiComment } from "@/services/comments/types";
import type { Comment } from "@/types/comment";

const defaultAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBpZrj2eP_b6pIV1lIkEIrS9YLnZha8pV5HQrx1Z7WoOiGX4Uy77lJvH2G9Jpp-xSwHy6bjnuHxbngbfiC78dacLbFc_52VHIW6_w3ZzJV1EMSLzGzi92Qxg2U3eDlwVmObaeOkyhfCBjrOjDNaEJ9eLf0FsBphxQWWV9anhwF9IuUP2INw5u_cYCYZW2HK2Aop2Wqvh33ZQzq0w3owSKipR5WaTQ-UXw-_0BwpAmCiMR5e3guZ6I8vMf2sl0NLy6QLZKD57mCH1qD";

function formatTimeAgo(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) {
    return "Vua xong";
  }

  const diffInMinutes = Math.max(1, Math.floor((Date.now() - createdTime) / 60000));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phut truoc`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} gio truoc`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngay truoc`;
}

export function adaptComment(comment: ApiComment): Comment {
  return {
    name: comment.userName,
    timeAgo: formatTimeAgo(comment.createdAt),
    likes: 0,
    avatar: defaultAvatar,
    content: comment.content,
  };
}
