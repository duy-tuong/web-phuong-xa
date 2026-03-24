"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Landmark,
  ClipboardList,
  Clock,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { format } from "date-fns";

type DashboardSummary = {
  totalUsers: number;
  totalArticles: number;
  totalServices: number;
  totalApplications: number;
  pendingComments: number;
};

type RecentArticle = {
  id: string;
  title: string;
  status: "published" | "draft";
  createdAt: string;
};

type RecentApplication = {
  id: string;
  applicantName: string;
  serviceName: string;
  serviceId?: string;
  status: "pending" | "processing" | "done" | "rejected";
  createdAt?: string;
};

type RecentComment = {
  id: string;
  userName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  articleTitle?: string;
};

const applicationLegendColors = [
  "hsl(34, 60%, 50%)",
  "hsl(146, 42%, 36%)",
  "hsl(210, 60%, 50%)",
  "hsl(0, 68%, 54%)",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function formatDateSafe(value: unknown, pattern: string) {
  if (!value) return "--";

  const dateValue = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(dateValue.getTime())) return "--";

  return format(dateValue, pattern);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardSummary>({
    totalUsers: 0,
    totalArticles: 0,
    totalServices: 0,
    totalApplications: 0,
    pendingComments: 0,
  });
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [applicationStatusData, setApplicationStatusData] = useState({
    labels: ["Chờ xử lý", "Đang xử lý", "Hoàn thành", "Từ chối"],
    data: [0, 0, 0, 0],
  });
  const [applicationTrend, setApplicationTrend] = useState<Array<{ label: string; value: number }>>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [displayName] = useState(() => {
    if (typeof window === "undefined") {
      return "Người dùng";
    }

    const storedName =
      localStorage.getItem("admin_display_name") ||
      localStorage.getItem("admin_name") ||
      localStorage.getItem("admin_username");

    return storedName && storedName.trim() ? storedName.trim() : "Người dùng";
  });
  const todayLabel = formatDateSafe(new Date(), "dd/MM/yyyy");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setErrorMessage("");
      try {
        const results = await Promise.allSettled([
          api.get("/dashboard/summary"),
          api.get("/dashboard/applications/monthly-chart"),
          api.get("/dashboard/applications/recent"),
          api.get("/articles/admin"),
          api.get("/comments"),
          api.get("/applications", { params: { status: "Pending", page: 1, pageSize: 1 } }),
          api.get("/applications", { params: { status: "Processing", page: 1, pageSize: 1 } }),
          api.get("/applications", { params: { status: "Approved", page: 1, pageSize: 1 } }),
          api.get("/applications", { params: { status: "Rejected", page: 1, pageSize: 1 } }),
        ]);

        if (!mounted) return;

        const [summaryRes, chartRes, recentAppsRes, articlesRes, commentsRes, pendingRes, processingRes, approvedRes, rejectedRes] = results.map(
          (result) => (result.status === "fulfilled" ? result.value : null)
        );

        if (!summaryRes) {
          setErrorMessage("Không thể tải dữ liệu dashboard.");
        }

        const summary = summaryRes?.data ?? {};
        setStats({
          totalUsers: summary.totalUsers ?? summary.TotalUsers ?? 0,
          totalArticles: summary.articles?.total ?? summary.Articles?.Total ?? 0,
          totalServices: summary.totalServices ?? summary.TotalServices ?? 0,
          totalApplications: summary.applications?.total ?? summary.Applications?.Total ?? 0,
          pendingComments: summary.pendingComments ?? summary.PendingComments ?? 0,
        });

        const chartData = Array.isArray(chartRes?.data) ? chartRes?.data : [];
        setApplicationTrend(
          chartData.map((item: { Date?: string; date?: string; Count?: number; count?: number }) => ({
            label: item.Date ?? item.date ?? "",
            value: Number(item.Count ?? item.count ?? 0),
          }))
        );

        const recentAppsData = Array.isArray(recentAppsRes?.data) ? recentAppsRes?.data : [];
        setRecentApplications(
          recentAppsData.map((app: { Id?: number | string; id?: number | string; ApplicantName?: string; applicantName?: string; ServiceName?: string; serviceName?: string; Status?: string; status?: string; CreatedAt?: string; createdAt?: string }) => ({
            id: String(app.Id ?? app.id ?? ""),
            applicantName: app.ApplicantName ?? app.applicantName ?? "",
            serviceName: app.ServiceName ?? app.serviceName ?? "",
            status: (app.Status ?? app.status ?? "Pending").toLowerCase() === "approved" ? "done" : (app.Status ?? app.status ?? "Pending").toLowerCase() === "processing" ? "processing" : (app.Status ?? app.status ?? "Pending").toLowerCase() === "rejected" ? "rejected" : "pending",
            createdAt: app.CreatedAt ?? app.createdAt ?? "",
          }))
        );

        const articlesData = Array.isArray(articlesRes?.data) ? articlesRes?.data : [];
        setRecentArticles(
          articlesData.slice(0, 5).map((article: { Id?: number | string; id?: number | string; Title?: string; title?: string; Status?: string; status?: string; CreatedAt?: string; createdAt?: string }) => ({
            id: String(article.Id ?? article.id ?? ""),
            title: article.Title ?? article.title ?? "",
            status: (article.Status ?? article.status ?? "Draft").toLowerCase() === "published" ? "published" : "draft",
            createdAt: article.CreatedAt ?? article.createdAt ?? new Date().toISOString(),
          }))
        );

        const commentsData = Array.isArray(commentsRes?.data) ? commentsRes?.data : [];
        setRecentComments(
          commentsData.slice(0, 5).map((comment: { Id?: number | string; id?: number | string; UserName?: string; userName?: string; Content?: string; content?: string; Status?: string; status?: string; ArticleTitle?: string; articleTitle?: string }) => ({
            id: String(comment.Id ?? comment.id ?? ""),
            userName: comment.UserName ?? comment.userName ?? "",
            content: comment.Content ?? comment.content ?? "",
            status: (comment.Status ?? comment.status ?? "Pending").toLowerCase() === "approved" ? "approved" : (comment.Status ?? comment.status ?? "Pending").toLowerCase() === "rejected" ? "rejected" : "pending",
            articleTitle: comment.ArticleTitle ?? comment.articleTitle ?? undefined,
          }))
        );

        const pendingTotal = pendingRes?.data?.total ?? 0;
        const processingTotal = processingRes?.data?.total ?? 0;
        const approvedTotal = approvedRes?.data?.total ?? 0;
        const rejectedTotal = rejectedRes?.data?.total ?? 0;
        setApplicationStatusData({
          labels: ["Chờ xử lý", "Đang xử lý", "Hoàn thành", "Từ chối"],
          data: [pendingTotal, processingTotal, approvedTotal, rejectedTotal],
        });
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải dữ liệu dashboard.");
      } finally {
        if (!mounted) return;
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const barData = {
    labels: applicationTrend.map((item) => item.label),
    datasets: [
      {
        label: "Hồ sơ",
        data: applicationTrend.map((item) => item.value),
        backgroundColor: "rgba(79, 122, 104, 0.82)",
        hoverBackgroundColor: "rgba(79, 122, 104, 0.92)",
        borderColor: "rgba(64, 102, 85, 0.95)",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: "flex" as const,
        maxBarThickness: 46,
        categoryPercentage: 0.86,
        barPercentage: 0.9,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(28, 54, 43, 0.92)",
        titleColor: "#f8f6f1",
        bodyColor: "#f8f6f1",
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: "#7a6d5d", font: { size: 11 } },
        grid: { color: "#e2e5dd", borderDash: [4, 4] },
      },
      x: {
        offset: true,
        ticks: { color: "#7a6d5d", font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  const doughnutData = {
    labels: applicationStatusData.labels,
    datasets: [
      {
        data: applicationStatusData.data,
        backgroundColor: applicationLegendColors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "65%",
  };

  const statusColorMap: Record<string, string> = {
    published: "border-[hsl(151,28%,74%)] text-[hsl(151,44%,33%)] bg-[linear-gradient(180deg,hsl(151,46%,95%),hsl(151,34%,90%))]",
    draft: "border-[hsl(210,10%,82%)] text-[hsl(210,9%,47%)] bg-[linear-gradient(180deg,hsl(210,22%,97%),hsl(210,18%,93%))]",
    pending: "border-[hsl(34,62%,76%)] text-[hsl(34,62%,46%)] bg-[linear-gradient(180deg,hsl(34,78%,96%),hsl(34,68%,91%))]",
    processing: "border-[hsl(146,28%,73%)] text-[hsl(146,44%,33%)] bg-[linear-gradient(180deg,hsl(146,38%,95%),hsl(146,28%,90%))]",
    done: "border-[hsl(209,50%,76%)] text-[hsl(210,56%,42%)] bg-[linear-gradient(180deg,hsl(210,76%,96%),hsl(210,64%,91%))]",
    approved: "border-[hsl(209,50%,76%)] text-[hsl(210,56%,42%)] bg-[linear-gradient(180deg,hsl(210,76%,96%),hsl(210,64%,91%))]",
    rejected: "border-[hsl(0,70%,82%)] text-[hsl(0,68%,48%)] bg-[linear-gradient(180deg,hsl(0,88%,97%),hsl(0,76%,93%))]",
  };

  const badgeBaseClass = "text-[10px] font-semibold leading-none px-2.5 py-0.5 rounded-full whitespace-nowrap border shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]";

  const viewAllLinkClass =
    "inline-flex items-center rounded-md border border-transparent px-2 py-1 text-[12px] font-semibold italic tracking-[0.01em] text-[hsl(209,54%,38%)] underline decoration-[hsl(209,45%,58%)] underline-offset-4 transition-all duration-200 hover:border-[hsl(209,44%,78%)] hover:bg-[hsl(209,78%,96%)] hover:text-[hsl(209,62%,30%)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(209,54%,45%)]";

  const statusLabelMap: Record<string, string> = {
    published: "Đã đăng",
    draft: "Nháp",
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    done: "Hoàn thành",
    rejected: "Từ chối",
  };

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-xl bg-[linear-gradient(102deg,hsl(158,56%,17%)_0%,hsl(155,46%,23%)_44%,hsl(152,35%,30%)_100%)] px-5 py-5 text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(0,0,0,0.2),transparent_38%),radial-gradient(circle_at_86%_16%,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="relative flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-[24px] sm:text-[30px] lg:text-[35px] font-semibold leading-[1.35] text-[hsl(42,76%,96%)]">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(38,80%,56%)]" />
            <span>
              Xin chào, <span className="text-white">{displayName}</span>
            </span>
          </div>
          <p className="text-[13px] sm:text-[16px] lg:text-[22px] text-[hsl(44,44%,82%)]">
            Tổng quan hoạt động hệ thống quản trị Phường Cao Lãnh • Hôm nay, {todayLabel}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Bài viết"
          value={stats.totalArticles}
          icon={FileText}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Dịch vụ công"
          value={stats.totalServices}
          icon={Landmark}
        />
        <StatCard
          title="Hồ sơ tiếp nhận"
          value={stats.totalApplications}
          icon={ClipboardList}
          trend={{ value: 25, positive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Hồ sơ 7 ngày gần nhất"
            description="Số lượng hồ sơ tiếp nhận trong 7 ngày gần nhất"
          >
            <div className="h-[280px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </ChartCard>
        </div>
        <ChartCard
          title="Trạng thái hồ sơ"
          description="Phân bổ trạng thái hồ sơ hiện tại"
        >
          <div className="h-[280px] flex flex-col items-center justify-center">
            <div className="h-[220px] w-full max-w-[260px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[12px] font-semibold text-[#7a6d5d]">
              {applicationStatusData.labels.map((label, index) => (
                <div key={label} className="inline-flex items-center gap-2 leading-none">
                  <span
                    className="h-[9px] w-[9px] rounded-full"
                    style={{ backgroundColor: applicationLegendColors[index] }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl border border-[hsl(120,10%,88%)] p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[hsl(146,32%,38%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Bài viết gần đây</h3>
            </div>
            <Link
              href="/admin/articles"
              className={viewAllLinkClass}
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {recentArticles.slice(0, 5).map((article) => (
              <div key={article.id} className="py-2.5 px-1 first:pt-1 last:pb-1 rounded-lg hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[hsl(165,16%,12%)] truncate">{article.title}</p>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[article.status]}`}>
                    {statusLabelMap[article.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[hsl(150,8%,44%)]">
                  <Clock className="w-3 h-3" />
                  {formatDateSafe(article.createdAt, "yyyy-MM-dd")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-[hsl(120,10%,88%)] p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-[hsl(34,58%,50%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Hồ sơ gần đây</h3>
            </div>
            <Link
              href="/admin/applications"
              className={viewAllLinkClass}
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {recentApplications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-2.5 px-1 first:pt-1 last:pb-1 rounded-lg hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[hsl(165,16%,12%)] truncate">{app.applicantName}</p>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[app.status]}`}>
                    {statusLabelMap[app.status]}
                  </Badge>
                </div>
                <p className="text-[12px] text-[hsl(150,8%,44%)] truncate">{app.serviceName || "--"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-xl border border-[hsl(120,10%,88%)] p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[hsl(22,36%,52%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Bình luận gần đây</h3>
            </div>
            <Link
              href="/admin/comments"
              className={viewAllLinkClass}
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {recentComments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="py-2.5 px-1 first:pt-1 last:pb-1 rounded-lg hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[hsl(165,16%,12%)]">{comment.userName}</span>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[comment.status] || 'border-stone-200 bg-stone-100 text-stone-600'}`}>
                    {comment.status === "approved" ? "Đã duyệt" : comment.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                  </Badge>
                </div>
                <p className="text-[12px] text-[hsl(150,8%,44%)] mt-0.5 line-clamp-2">{comment.content}</p>
                <p className="text-[11px] text-[hsl(150,8%,64%)] mt-0.5 line-clamp-1">{comment.articleTitle || "Bình luận bài viết"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
