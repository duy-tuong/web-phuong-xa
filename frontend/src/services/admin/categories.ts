import api from "@/services/api";
import { toCategory } from "@/services/admin/contentMappers";
import type {
  ApiCategory,
  CategoryPayload,
} from "@/services/admin/types";
import type { Category } from "@/types";

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
