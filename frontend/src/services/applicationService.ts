import api from "@/services/api";
import { toApplication, type ApiApplication } from "@/services/shared/applicationMapper";
import type { Application } from "@/types";

type CreateApplicationPayload = {
  serviceId: number;
  applicantName: string;
  phone: string;
  email: string;
  attachedFiles?: string;
};

type CreateApplicationResponse = {
  message: string;
  applicationId: number;
  status: string;
};

export async function createPublicApplication(payload: CreateApplicationPayload): Promise<CreateApplicationResponse> {
  const response = await api.post<CreateApplicationResponse>("/applications", payload);
  return response.data;
}

export async function uploadApplicationAttachment(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ url?: string }>("/applications/upload-attachment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.url || "";
}

export async function searchPublicApplications(params: { phone?: string; email?: string }): Promise<Application[]> {
  const response = await api.get<ApiApplication[]>("/applications/search", { params });
  return Array.isArray(response.data) ? response.data.map(toApplication) : [];
}
