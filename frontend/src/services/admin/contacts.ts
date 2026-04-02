import api from "@/services/api";
import type { PaginatedResponse } from "@/services/admin/types";
import type { Contact } from "@/types";

export type ApiContact = {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  category: string;
  content: string;
  status: string;
  createdAt: string;
};

function normalizeStatus(value: string | undefined): Contact["status"] {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "processed") return "processed";
  if (normalized === "resolved") return "resolved";
  return "pending";
}

function toBackendStatus(status: Contact["status"]) {
  if (status === "processed") return "Processed";
  if (status === "resolved") return "Resolved";
  return "Pending";
}

function toContact(row: ApiContact): Contact {
  return {
    id: String(row.id),
    fullName: row.fullName,
    phone: row.phone,
    email: row.email ?? undefined,
    category: row.category,
    content: row.content,
    status: normalizeStatus(row.status),
    createdAt: row.createdAt,
  };
}

export async function fetchContactsAdmin(params?: {
  page?: number;
  pageSize?: number;
  status?: Contact["status"] | "all";
}): Promise<PaginatedResponse<Contact>> {
  const requestParams = {
    page: params?.page,
    pageSize: params?.pageSize,
    status: params?.status && params.status !== "all" ? toBackendStatus(params.status) : undefined,
  };

  const response = await api.get<PaginatedResponse<ApiContact>>("/contacts", { params: requestParams });

  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toContact) : [],
  };
}

export async function updateContactStatus(id: string, status: Contact["status"]): Promise<void> {
  await api.put(`/contacts/${id}/status`, toBackendStatus(status));
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/contacts/${id}`);
}
