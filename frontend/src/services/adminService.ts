import axios from "axios";

import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import type {
  Application,
  Article,
  Category,
  DashboardStats,
  LogEntry,
  MediaFile,
  Role,
  Service,
  User,
  Comment,
} from "@/types";

type PaginatedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
};

type ApiRole = {
  id: number;
  name: string;
};

type ApiUser = {
  id: number;
  username: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  roleId: number;
  role?: ApiRole | null;
  createdAt: string;
};

type ApiCategory = {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
};

type ApiArticle = {
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

type ApiComment = {
  id: number;
  articleId: number;
  userName: string;
  content: string;
  status: string;
  createdAt: string;
  articleTitle?: string | null;
};

type ApiApplication = {
  id: number;
  serviceId: number;
  serviceName?: string | null;
  applicantName: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
};

type ApiMedia = {
  id: number;
  fileName: string;
  filePath: string;
  type: string;
  fileType?: string | null;
  fileSize?: number | null;
  uploadedBy: string;
  uploadedAt: string;
};

type ApiService = {
  id: number;
  name: string;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: number;
  templateFile?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ApiLog = {
  id: number;
  user?: string | null;
  action: string;
  entity: string;
  detail?: string | null;
  createdAt: string;
};

type ApiDashboardSummary = {
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

type ApiDashboardChartPoint = {
  date: string;
  count: number;
};

type ApiDashboardRecentApplication = {
  id: number;
  applicantName: string;
  serviceName?: string | null;
  status: string;
  createdAt: string;
};

type DashboardSummary = DashboardStats & {
  publishedArticles: number;
  draftArticles: number;
  pendingApplications: number;
  approvedApplications: number;
  pendingComments: number;
};

type ProfileUpdatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
};

type UserPayload = {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  roleId: string;
  phone?: string;
  avatarUrl?: string;
};

type CategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
};

type ServicePayload = {
  name: string;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: number;
  templateFile?: string;
};

type ArticlePayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  featuredImage?: string;
  content: string;
  categoryId: string;
  status: "draft" | "published";
};

function toRole(role: ApiRole): Role {
  return {
    id: String(role.id),
    name: role.name,
  };
}

function toUser(user: ApiUser): User {
  return {
    id: String(user.id),
    username: user.username,
    email: user.email,
    fullName: user.fullName ?? undefined,
    phone: user.phone ?? undefined,
    avatarUrl: resolveApiAssetUrl(user.avatarUrl) || user.avatarUrl || undefined,
    roleId: String(user.roleId),
    role: user.role ? toRole(user.role) : undefined,
    createdAt: user.createdAt,
  };
}

function toCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    description: category.description ?? undefined,
    slug: category.slug ?? undefined,
  };
}

function normalizeArticleStatus(status: string | undefined): Article["status"] {
  return String(status).toLowerCase() === "published" ? "published" : "draft";
}

function normalizeCommentStatus(status: string | undefined): Comment["status"] {
  const normalized = String(status).toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

function normalizeApplicationStatus(status: string | undefined): Application["status"] {
  const normalized = String(status).toLowerCase();
  if (normalized === "processing") return "processing";
  if (normalized === "approved") return "done";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

function toBackendApplicationStatus(status: Application["status"]): string {
  if (status === "processing") return "Processing";
  if (status === "done") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function toBackendCommentStatus(status: Comment["status"]): string {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function toBackendArticleStatus(status: Article["status"]): string {
  return status === "published" ? "Published" : "Draft";
}

function buildExcerpt(content: string) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function buildArticleAuthor(article: ApiArticle): User | undefined {
  if (!article.authorId && !article.author) {
    return undefined;
  }

  const name = article.author?.trim() || `user-${article.authorId}`;
  return {
    id: String(article.authorId),
    username: name,
    fullName: name,
    email: "",
    roleId: "",
    createdAt: article.createdAt,
  };
}

function buildArticleCategory(article: ApiArticle): Category | undefined {
  if (!article.categoryId && !article.category) {
    return undefined;
  }

  return {
    id: String(article.categoryId),
    name: article.category?.trim() || `Category ${article.categoryId}`,
  };
}

function toArticle(article: ApiArticle): Article {
  return {
    id: String(article.id),
    title: article.title,
    slug: article.slug,
    content: article.content ?? "",
    categoryId: String(article.categoryId),
    authorId: String(article.authorId),
    status: normalizeArticleStatus(article.status),
    createdAt: article.createdAt,
    publishedAt: article.publishedAt ?? null,
    excerpt: article.excerpt ?? undefined,
    featuredImage: resolveApiAssetUrl(article.featuredImage) || article.featuredImage || undefined,
    category: buildArticleCategory(article),
    author: buildArticleAuthor(article),
  };
}

function toComment(comment: ApiComment): Comment {
  return {
    id: String(comment.id),
    articleId: String(comment.articleId),
    userName: comment.userName,
    content: comment.content,
    status: normalizeCommentStatus(comment.status),
    createdAt: comment.createdAt,
    articleTitle: comment.articleTitle ?? undefined,
  };
}

function toApplication(application: ApiApplication): Application {
  return {
    id: String(application.id),
    serviceId: String(application.serviceId),
    applicantName: application.applicantName,
    phone: application.phone,
    email: application.email,
    status: normalizeApplicationStatus(application.status),
    createdAt: application.createdAt,
    serviceName: application.serviceName ?? undefined,
  };
}

function toMedia(file: ApiMedia): MediaFile {
  return {
    id: String(file.id),
    fileName: file.fileName,
    filePath: file.filePath,
    type: file.type,
    uploadedBy: file.uploadedBy,
    uploadedAt: file.uploadedAt,
    url: resolveApiAssetUrl(file.filePath) || file.filePath,
    fileType: file.fileType ?? undefined,
    fileSize: file.fileSize ?? undefined,
    createdAt: file.uploadedAt,
  };
}

function toService(service: ApiService): Service {
  return {
    id: String(service.id),
    name: service.name,
    description: service.description,
    requiredDocuments: service.requiredDocuments,
    processingTime: service.processingTime,
    fee: Number(service.fee || 0),
    templateFile: resolveApiAssetUrl(service.templateFile) || service.templateFile || undefined,
    createdAt: service.createdAt ?? undefined,
    updatedAt: service.updatedAt ?? undefined,
  };
}

function toLog(log: ApiLog): LogEntry {
  return {
    id: String(log.id),
    userId: log.user || "",
    user: log.user || undefined,
    action: log.action,
    entity: log.entity,
    module: log.entity,
    detail: log.detail ?? undefined,
    createdAt: log.createdAt,
  };
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.title === "string" && data.title.trim()) {
      return data.title;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Co loi xay ra khi goi API.";
}

export async function fetchRoles(): Promise<Role[]> {
  const response = await api.get<ApiRole[]>("/roles");
  return Array.isArray(response.data) ? response.data.map(toRole) : [];
}

export async function createRole(name: string): Promise<void> {
  await api.post("/roles", JSON.stringify(name.trim()), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateRole(id: string, name: string): Promise<void> {
  await api.put(`/roles/${id}`, JSON.stringify(name.trim()), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/roles/${id}`);
}

export async function fetchUsers(params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<PaginatedResponse<User>> {
  const response = await api.get<PaginatedResponse<ApiUser>>("/users", { params });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toUser) : [],
  };
}

export async function createUser(payload: UserPayload): Promise<void> {
  await api.post("/users", {
    username: payload.username.trim(),
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    password: payload.password,
    roleId: Number(payload.roleId),
    phone: payload.phone?.trim() || null,
    avatarUrl: payload.avatarUrl?.trim() || null,
  });
}

export async function updateUser(id: string, payload: UserPayload): Promise<void> {
  await api.put(`/users/${id}`, {
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    password: payload.password?.trim() || null,
    roleId: Number(payload.roleId),
    phone: payload.phone?.trim() || null,
    avatarUrl: payload.avatarUrl?.trim() || null,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get<ApiUser>("/auth/me");
  return toUser(response.data);
}

export async function updateCurrentUser(payload: ProfileUpdatePayload): Promise<User> {
  const response = await api.put<{ user: ApiUser }>("/auth/me", {
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || null,
    avatarUrl: payload.avatarUrl?.trim() || null,
    currentPassword: payload.currentPassword?.trim() || null,
    newPassword: payload.newPassword?.trim() || null,
  });

  return toUser(response.data.user);
}

export async function fetchCategoriesAdmin(): Promise<Category[]> {
  const response = await api.get<ApiCategory[]>("/categories");
  return Array.isArray(response.data) ? response.data.map(toCategory) : [];
}

export async function createCategory(payload: CategoryPayload): Promise<void> {
  await api.post("/categories", {
    name: payload.name.trim(),
    slug: payload.slug?.trim() || null,
    description: payload.description?.trim() || "",
  });
}

export async function updateCategory(id: string, payload: CategoryPayload): Promise<void> {
  await api.put(`/categories/${id}`, {
    name: payload.name.trim(),
    slug: payload.slug?.trim() || null,
    description: payload.description?.trim() || "",
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

export async function fetchServicesAdmin(): Promise<Service[]> {
  const response = await api.get<ApiService[]>("/services");
  return Array.isArray(response.data) ? response.data.map(toService) : [];
}

export async function createService(payload: ServicePayload): Promise<void> {
  await api.post("/services", {
    name: payload.name.trim(),
    description: payload.description.trim(),
    requiredDocuments: payload.requiredDocuments.trim(),
    processingTime: payload.processingTime.trim(),
    fee: payload.fee,
    templateFile: payload.templateFile?.trim() || null,
  });
}

export async function updateService(id: string, payload: ServicePayload): Promise<void> {
  await api.put(`/services/${id}`, {
    name: payload.name.trim(),
    description: payload.description.trim(),
    requiredDocuments: payload.requiredDocuments.trim(),
    processingTime: payload.processingTime.trim(),
    fee: payload.fee,
    templateFile: payload.templateFile?.trim() || null,
  });
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}

export async function fetchAdminArticles(): Promise<Article[]> {
  const response = await api.get<ApiArticle[]>("/articles/admin");
  return Array.isArray(response.data) ? response.data.map(toArticle) : [];
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

export async function fetchCommentsAdmin(): Promise<Comment[]> {
  const response = await api.get<ApiComment[]>("/comments");
  return Array.isArray(response.data) ? response.data.map(toComment) : [];
}

export async function updateCommentStatus(id: string, status: Comment["status"]): Promise<void> {
  await api.put(`/comments/${id}`, {
    status: toBackendCommentStatus(status),
  });
}

export async function deleteCommentAdmin(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}

export async function fetchApplicationsAdmin(params?: {
  page?: number;
  pageSize?: number;
  status?: Application["status"] | "all";
}): Promise<PaginatedResponse<Application>> {
  const requestParams = {
    page: params?.page,
    pageSize: params?.pageSize,
    status:
      params?.status && params.status !== "all"
        ? toBackendApplicationStatus(params.status as Application["status"])
        : undefined,
  };

  const response = await api.get<PaginatedResponse<ApiApplication>>("/applications", {
    params: requestParams,
  });

  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toApplication) : [],
  };
}

export async function updateApplicationStatus(id: string, status: Application["status"]): Promise<void> {
  await api.put(`/applications/${id}/status`, {
    status: toBackendApplicationStatus(status),
  });
}

export async function fetchMediaAdmin(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<MediaFile>> {
  const response = await api.get<PaginatedResponse<ApiMedia>>("/media", { params });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toMedia) : [],
  };
}

export async function uploadMedia(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteMediaAdmin(id: string): Promise<void> {
  await api.delete(`/media/${id}`);
}

export async function fetchLogsAdmin(params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  entityName?: string;
}): Promise<PaginatedResponse<LogEntry>> {
  const response = await api.get<PaginatedResponse<ApiLog>>("/auditlogs", { params });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toLog) : [],
  };
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiDashboardSummary>("/dashboard/summary");
  const data = response.data;

  return {
    totalUsers: data.totalUsers,
    totalArticles: data.articles.total,
    totalServices: data.totalServices,
    totalApplications: data.applications.total,
    publishedArticles: data.articles.published,
    draftArticles: data.articles.drafts,
    pendingApplications: data.applications.pending,
    approvedApplications: data.applications.approved,
    pendingComments: data.pendingComments,
  };
}

export async function fetchDashboardApplicationsChart(): Promise<ApiDashboardChartPoint[]> {
  const response = await api.get<ApiDashboardChartPoint[]>("/dashboard/applications/monthly-chart");
  return Array.isArray(response.data) ? response.data : [];
}

export async function fetchDashboardRecentApplications(): Promise<Application[]> {
  const response = await api.get<ApiDashboardRecentApplication[]>("/dashboard/applications/recent");
  return Array.isArray(response.data)
    ? response.data.map((item) =>
        toApplication({
          id: item.id,
          serviceId: 0,
          serviceName: item.serviceName,
          applicantName: item.applicantName,
          phone: "",
          email: "",
          status: item.status,
          createdAt: item.createdAt,
        }))
    : [];
}
