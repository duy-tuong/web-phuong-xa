import api from "@/services/api";
import { toApplication, type ApiApplication } from "@/services/shared/applicationMapper";
import { toBackendApplicationStatus } from "@/services/admin/status";
import type { PaginatedResponse } from "@/services/admin/types";
import type { Application } from "@/types";

export async function fetchApplicationsAdmin(params?: {
  page?: number;
  pageSize?: number;
  status?: Application["status"] | "all";
}): Promise<PaginatedResponse<Application>> {
  const requestParams = {
    page: params?.page,
    pageSize: params?.pageSize,
    status:
      params?.status && params.status !== "all"
        ? toBackendApplicationStatus(params.status as Application["status"])
        : undefined,
  };

  const response = await api.get<PaginatedResponse<ApiApplication>>("/applications", {
    params: requestParams,
  });

  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toApplication) : [],
  };
}

export async function updateApplicationStatus(id: string, status: Application["status"]): Promise<void> {
  await api.put(`/applications/${id}/status`, {
    status: toBackendApplicationStatus(status),
  });
}
