import type {
  Application,
  DashboardStats,
} from "@/types";

export type PaginatedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
};

export type ApiRole = {
  id: number;
  name: string;
};

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  roleId?: number;
  role?: ApiRole | string | null;
  createdAt: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
};

export type ApiArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  content?: string | null;
  categoryId: number;
  category?: string | null;
  authorId: number;
  author?: string | null;
  status: string;
  createdAt: string;
  publishedAt?: string | null;
};

export type LegacyCollectionResponse<T> = {
  value?: T[];
  Count?: number;
  count?: number;
};

export type ApiComment = {
  id: number;
  articleId: number;
  userName: string;
  content: string;
  status: string;
  createdAt: string;
  articleTitle?: string | null;
};

export type ApiMedia = {
  id: number;
  fileName: string;
  filePath: string;
  type: string;
  fileType?: string | null;
  fileSize?: number | null;
  uploadedBy: string;
  uploadedAt: string;
};

export type ApiService = {
  id: number;
  name: string;
  category?: string | null;
  field?: string | null;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: number;
  templateFile?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ApiLog = {
  id: number;
  user?: string | null;
  action: string;
  entity: string;
  detail?: string | null;
  createdAt: string;
};

export type ApiDashboardSummary = {
  totalUsers: number;
  articles: {
    total: number;
    published: number;
    drafts: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
  };
  totalServices: number;
  pendingComments: number;
};

export type DashboardSummary = DashboardStats & {
  publishedArticles: number;
  draftArticles: number;
  pendingApplications: number;
  approvedApplications: number;
  pendingComments: number;
};

export type ProfileUpdatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type UserPayload = {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  roleId: string;
  phone?: string;
  avatarUrl?: string;
};

export type CategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
};

export type ServicePayload = {
  name: string;
  category?: string;
  field?: string;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: number;
  templateFile?: string;
};

export type ArticlePayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  featuredImage?: string;
  content: string;
  categoryId: string;
  status: "draft" | "published";
};
