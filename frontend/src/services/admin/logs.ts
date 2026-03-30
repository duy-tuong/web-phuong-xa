import api from "@/services/api";
import { toLog } from "@/services/admin/contentMappers";
import type {
  ApiLog,
  PaginatedResponse,
} from "@/services/admin/types";
import type { LogEntry } from "@/types";

export async function fetchLogsAdmin(params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  entityName?: string;
}): Promise<PaginatedResponse<LogEntry>> {
  const response = await api.get<PaginatedResponse<ApiLog>>("/auditlogs", { params });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toLog) : [],
  };
}
