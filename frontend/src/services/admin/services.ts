import api from "@/services/api";
import { toService } from "@/services/admin/contentMappers";
import type {
  ApiService,
  ServicePayload,
} from "@/services/admin/types";
import type { Service } from "@/types";

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
