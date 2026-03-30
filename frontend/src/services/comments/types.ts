export type ApiComment = {
  id: number;
  userName: string;
  content: string;
  createdAt: string;
};

export type SubmitCommentInput = {
  slug: string;
  userName: string;
  content: string;
};
