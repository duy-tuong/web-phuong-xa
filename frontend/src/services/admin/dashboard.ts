import api from "@/services/api";
import type {
  ApiDashboardSummary,
  DashboardSummary,
} from "@/services/admin/types";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiDashboardSummary>("/dashboard/summary");
  const data = response.data;

  return {
    totalUsers: data.totalUsers,
    totalArticles: data.articles.total,
    totalServices: data.totalServices,
    totalApplications: data.applications.total,
    publishedArticles: data.articles.published,
    draftArticles: data.articles.drafts,
    pendingApplications: data.applications.pending,
    approvedApplications: data.applications.approved,
    pendingComments: data.pendingComments,
  };
}
