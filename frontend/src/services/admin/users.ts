import api from "@/services/api";
import {
  type ApiUser,
  type PaginatedResponse,
  type UserPayload,
} from "@/services/admin/types";
import { toUser } from "@/services/admin/userMappers";
import type { User } from "@/types";

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
