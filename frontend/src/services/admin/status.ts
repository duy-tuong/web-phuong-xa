import type {
  Application,
  Article,
  Comment,
} from "@/types";

export function normalizeArticleStatus(status: string | undefined): Article["status"] {
  return String(status).toLowerCase() === "published" ? "published" : "draft";
}

export function normalizeCommentStatus(status: string | undefined): Comment["status"] {
  const normalized = String(status).toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

export function toBackendApplicationStatus(status: Application["status"]): string {
  if (status === "processing") return "Processing";
  if (status === "done") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export function toBackendCommentStatus(status: Comment["status"]): string {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export function toBackendArticleStatus(status: Article["status"]): string {
  return status === "published" ? "Published" : "Draft";
}
