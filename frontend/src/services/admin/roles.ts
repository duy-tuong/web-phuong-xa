import api from "@/services/api";
import { unwrapLegacyCollection } from "@/services/admin/collections";
import type {
  ApiRole,
  LegacyCollectionResponse,
} from "@/services/admin/types";
import { toRole } from "@/services/admin/userMappers";
import type { Role } from "@/types";

export async function fetchRoles(): Promise<Role[]> {
  const response = await api.get<ApiRole[] | LegacyCollectionResponse<ApiRole>>("/roles");
  return unwrapLegacyCollection(response.data).map(toRole);
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
