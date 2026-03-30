import api from "@/services/api";
import type {
  ApiUser,
  ProfileUpdatePayload,
} from "@/services/admin/types";
import { toUser } from "@/services/admin/userMappers";
import type { User } from "@/types";

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
