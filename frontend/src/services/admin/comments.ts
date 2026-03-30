import api from "@/services/api";
import {
  toComment,
} from "@/services/admin/contentMappers";
import { toBackendCommentStatus } from "@/services/admin/status";
import type {
  ApiComment,
  LegacyCollectionResponse,
} from "@/services/admin/types";
import type { Comment } from "@/types";

export async function fetchCommentsAdmin(): Promise<Comment[]> {
  const response = await api.get<ApiComment[] | LegacyCollectionResponse<ApiComment>>("/comments");
  const rows = Array.isArray(response.data) ? response.data : response.data?.value ?? [];
  return rows.map(toComment);
}

export async function updateCommentStatus(id: string, status: Comment["status"]): Promise<void> {
  await api.put(`/comments/${id}`, {
    status: toBackendCommentStatus(status),
  });
}

export async function deleteCommentAdmin(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}
