import type { Comment } from "@/types/comment";

const defaultComments: Comment[] = [
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

const commentsByArticleId: Record<string, Comment[]> = {
  default: defaultComments,
};

export async function getCommentsByArticleId(id: string): Promise<Comment[]> {
  return commentsByArticleId[id] ?? commentsByArticleId.default;
}