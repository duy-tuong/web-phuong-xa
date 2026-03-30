import type { Application } from "@/types";

export type ApiApplication = {
  id: number;
  serviceId: number;
  serviceName?: string | null;
  applicantName: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
};

function normalizeApplicationStatus(status: string | undefined): Application["status"] {
  const normalized = String(status).toLowerCase();
  if (normalized === "processing") return "processing";
  if (normalized === "approved") return "done";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

export function toApplication(application: ApiApplication): Application {
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
