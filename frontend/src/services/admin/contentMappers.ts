import { resolveApiAssetUrl } from "@/lib/api-base-url";
import {
  normalizeArticleStatus,
  normalizeCommentStatus,
} from "@/services/admin/status";
import type {
  ApiArticle,
  ApiCategory,
  ApiComment,
  ApiLog,
  ApiMedia,
  ApiService,
} from "@/services/admin/types";
import type {
  Article,
  Category,
  Comment,
  LogEntry,
  MediaFile,
  Service,
  User,
} from "@/types";

export function toCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    description: category.description ?? undefined,
    slug: category.slug ?? undefined,
  };
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

export function toArticle(article: ApiArticle): Article {
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

export function toComment(comment: ApiComment): Comment {
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

export function toMedia(file: ApiMedia): MediaFile {
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

export function toService(service: ApiService): Service {
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

export function toLog(log: ApiLog): LogEntry {
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
