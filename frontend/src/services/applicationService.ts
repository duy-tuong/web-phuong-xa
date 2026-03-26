import api from "@/services/api";
import type { Application } from "@/types";

type ApiApplication = {
  id: number;
  serviceId: number;
  serviceName?: string | null;
  applicantName: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
};

type CreateApplicationPayload = {
  serviceId: number;
  applicantName: string;
  phone: string;
  email: string;
};

type CreateApplicationResponse = {
  message: string;
  applicationId: number;
  status: string;
};

function normalizeApplicationStatus(status: string | undefined): Application["status"] {
  const normalized = String(status).toLowerCase();
  if (normalized === "processing") return "processing";
  if (normalized === "approved") return "done";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

function toApplication(application: ApiApplication): Application {
  return {
    id: String(application.id),
    serviceId: String(application.serviceId),
    applicantName: application.applicantName,
    phone: application.phone,
    email: application.email,
    status: normalizeApplicationStatus(application.status),
    createdAt: application.createdAt,
    serviceName: application.serviceName ?? undefined,
  };
}

export async function createPublicApplication(payload: CreateApplicationPayload): Promise<CreateApplicationResponse> {
  const response = await api.post<CreateApplicationResponse>("/applications", payload);
  return response.data;
}

export async function searchPublicApplications(params: { phone?: string; email?: string }): Promise<Application[]> {
  const response = await api.get<ApiApplication[]>("/applications/search", { params });
  return Array.isArray(response.data) ? response.data.map(toApplication) : [];
}
