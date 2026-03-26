"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  ClipboardList,
  Clock,
  FileText,
  Landmark,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

import ChartCard from "@/components/admin/ChartCard";
import StatCard from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAdminArticles,
  fetchApplicationsAdmin,
  fetchCommentsAdmin,
  fetchDashboardSummary,
  getErrorMessage,
} from "@/services/adminService";
import { Application, Article, Comment } from "@/types";

type ArticleRange = "3" | "6" | "12";

type DashboardState = {
  totalUsers: number;
  totalArticles: number;
  totalServices: number;
  totalApplications: number;
  articles: Article[];
  comments: Comment[];
  applications: Application[];
};

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const statusColorMap: Record<string, string> = {
  published: "border-[hsl(151,28%,74%)] text-[hsl(151,44%,33%)] bg-[linear-gradient(180deg,hsl(151,46%,95%),hsl(151,34%,90%))]",
  draft: "border-[hsl(210,10%,82%)] text-[hsl(210,9%,47%)] bg-[linear-gradient(180deg,hsl(210,22%,97%),hsl(210,18%,93%))]",
  pending: "border-[hsl(34,62%,76%)] text-[hsl(34,62%,46%)] bg-[linear-gradient(180deg,hsl(34,78%,96%),hsl(34,68%,91%))]",
  processing: "border-[hsl(146,28%,73%)] text-[hsl(146,44%,33%)] bg-[linear-gradient(180deg,hsl(146,38%,95%),hsl(146,28%,90%))]",
  done: "border-[hsl(209,50%,76%)] text-[hsl(210,56%,42%)] bg-[linear-gradient(180deg,hsl(210,76%,96%),hsl(210,64%,91%))]",
  rejected: "border-[hsl(0,70%,82%)] text-[hsl(0,68%,48%)] bg-[linear-gradient(180deg,hsl(0,88%,97%),hsl(0,76%,93%))]",
  approved: "border-[hsl(209,50%,76%)] text-[hsl(210,56%,42%)] bg-[linear-gradient(180deg,hsl(210,76%,96%),hsl(210,64%,91%))]",
};

const statusLabelMap: Record<string, string> = {
  published: "Da dang",
  draft: "Nhap",
  pending: "Cho xu ly",
  processing: "Dang xu ly",
  done: "Hoan thanh",
  rejected: "Tu choi",
  approved: "Da duyet",
};

function buildMonthSeries(articles: Article[]) {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    return {
      key,
      label: format(date, "MM/yy"),
      value: 0,
    };
  });

  for (const article of articles) {
    const date = new Date(article.createdAt);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const target = months.find((item) => item.key === key);
    if (target) {
      target.value += 1;
    }
  }

  return months;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [articleRange, setArticleRange] = useState<ArticleRange>("6");
  const [displayName] = useState(() => {
    if (typeof window === "undefined") {
      return "Nguoi dung";
    }

    return (
      localStorage.getItem("admin_display_name") ||
      localStorage.getItem("admin_name") ||
      localStorage.getItem("admin_username") ||
      "Nguoi dung"
    );
  });

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [summary, articleRows, commentRows, applicationRows] = await Promise.all([
        fetchDashboardSummary(),
        fetchAdminArticles(),
        fetchCommentsAdmin(),
        fetchApplicationsAdmin({ page: 1, pageSize: 200 }),
      ]);

      setDashboard({
        totalUsers: summary.totalUsers,
        totalArticles: summary.totalArticles,
        totalServices: summary.totalServices,
        totalApplications: summary.totalApplications,
        articles: articleRows,
        comments: commentRows,
        applications: applicationRows.data,
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const todayLabel = format(new Date(), "dd/MM/yyyy");
  const monthSeries = useMemo(() => buildMonthSeries(dashboard?.articles || []), [dashboard?.articles]);
  const visibleSeries = useMemo(() => monthSeries.slice(-Number(articleRange)), [articleRange, monthSeries]);

  const applicationCounts = useMemo(() => {
    const counts = { pending: 0, processing: 0, done: 0, rejected: 0 };
    for (const app of dashboard?.applications || []) {
      counts[app.status] += 1;
    }
    return counts;
  }, [dashboard?.applications]);

  const barData = {
    labels: visibleSeries.map((item) => item.label),
    datasets: [
      {
        label: "Bai viet",
        data: visibleSeries.map((item) => item.value),
        backgroundColor: "rgba(79, 122, 104, 0.82)",
        hoverBackgroundColor: "rgba(79, 122, 104, 0.92)",
        borderColor: "rgba(64, 102, 85, 0.95)",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Cho xu ly", "Dang xu ly", "Hoan thanh", "Tu choi"],
    datasets: [
      {
        data: [
          applicationCounts.pending,
          applicationCounts.processing,
          applicationCounts.done,
          applicationCounts.rejected,
        ],
        backgroundColor: [
          "hsl(34, 60%, 50%)",
          "hsl(146, 42%, 36%)",
          "hsl(210, 60%, 50%)",
          "hsl(0, 68%, 54%)",
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const badgeBaseClass = "text-[10px] font-semibold leading-none px-2.5 py-0.5 rounded-full whitespace-nowrap border shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]";
  const viewAllLinkClass = "inline-flex items-center rounded-md border border-transparent px-2 py-1 text-[12px] font-semibold italic tracking-[0.01em] text-[hsl(209,54%,38%)] underline decoration-[hsl(209,45%,58%)] underline-offset-4 transition-all duration-200 hover:border-[hsl(209,44%,78%)] hover:bg-[hsl(209,78%,96%)] hover:text-[hsl(209,62%,30%)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(209,54%,45%)]";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl bg-[linear-gradient(102deg,hsl(158,56%,17%)_0%,hsl(155,46%,23%)_44%,hsl(152,35%,30%)_100%)] px-5 py-5 text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(0,0,0,0.2),transparent_38%),radial-gradient(circle_at_86%_16%,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="relative flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-[24px] sm:text-[30px] lg:text-[35px] font-semibold leading-[1.35] text-[hsl(42,76%,96%)]">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(38,80%,56%)]" />
            <span>Xin chao, <span className="text-white">{displayName}</span></span>
          </div>
          <p className="text-[13px] sm:text-[16px] lg:text-[22px] text-[hsl(44,44%,82%)]">
            Tong quan du lieu that tu he thong quan tri. Hom nay, {todayLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Tong nguoi dung" value={dashboard?.totalUsers || 0} icon={Users} />
        <StatCard title="Bai viet" value={dashboard?.totalArticles || 0} icon={FileText} />
        <StatCard title="Dich vu cong" value={dashboard?.totalServices || 0} icon={Landmark} />
        <StatCard title="Ho so tiep nhan" value={dashboard?.totalApplications || 0} icon={ClipboardList} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Bai viet theo thang"
            description="Thong ke so bai viet tao moi tu API admin articles"
            action={
              <Select value={articleRange} onValueChange={(value) => setArticleRange(value as ArticleRange)}>
                <SelectTrigger className="h-8 w-[126px] border-stone-200 bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 thang</SelectItem>
                  <SelectItem value="6">6 thang</SelectItem>
                  <SelectItem value="12">12 thang</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            <div className="h-[280px]">{loading ? <div className="pt-20 text-center text-sm text-stone-400">Dang tai bieu do...</div> : <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}</div>
          </ChartCard>
        </div>
        <ChartCard title="Trang thai ho so" description="Phan bo trang thai ho so tu API applications">
          <div className="h-[280px] flex flex-col items-center justify-center">
            <div className="h-[220px] w-full max-w-[260px]">{loading ? <div className="pt-20 text-center text-sm text-stone-400">Dang tai bieu do...</div> : <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: "65%" }} />}</div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border border-[hsl(120,10%,88%)] bg-white p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[hsl(146,32%,38%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Bai viet gan day</h3>
            </div>
            <Link href="/admin/articles" className={viewAllLinkClass}>Xem tat ca</Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {(dashboard?.articles || []).slice(0, 5).map((article) => (
              <div key={article.id} className="rounded-lg px-1 py-2.5 first:pt-1 last:pb-1 hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-[hsl(165,16%,12%)]">{article.title}</p>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[article.status]}`}>
                    {statusLabelMap[article.status]}
                  </Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[hsl(150,8%,44%)]">
                  <Clock className="h-3 w-3" />
                  {format(new Date(article.createdAt), "yyyy-MM-dd")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[hsl(120,10%,88%)] bg-white p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-3.5 w-3.5 text-[hsl(34,58%,50%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Ho so gan day</h3>
            </div>
            <Link href="/admin/applications" className={viewAllLinkClass}>Xem tat ca</Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {(dashboard?.applications || []).slice(0, 5).map((app) => (
              <div key={app.id} className="rounded-lg px-1 py-2.5 first:pt-1 last:pb-1 hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-[hsl(165,16%,12%)]">{app.applicantName}</p>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[app.status]}`}>
                    {statusLabelMap[app.status]}
                  </Badge>
                </div>
                <p className="truncate text-[12px] text-[hsl(150,8%,44%)]">{app.serviceName || app.serviceId}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[hsl(120,10%,88%)] bg-white p-4 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-[hsl(22,36%,52%)]" />
              <h3 className="text-[14px] font-semibold text-[hsl(165,16%,12%)]">Binh luan gan day</h3>
            </div>
            <Link href="/admin/comments" className={viewAllLinkClass}>Xem tat ca</Link>
          </div>
          <div className="divide-y divide-[hsl(120,10%,90%)]">
            {(dashboard?.comments || []).slice(0, 5).map((comment) => (
              <div key={comment.id} className="rounded-lg px-1 py-2.5 first:pt-1 last:pb-1 hover:bg-[hsl(45,24%,95%)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[hsl(165,16%,12%)]">{comment.userName}</span>
                  <Badge variant="secondary" className={`${badgeBaseClass} ${statusColorMap[comment.status]}`}>
                    {statusLabelMap[comment.status]}
                  </Badge>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[12px] text-[hsl(150,8%,44%)]">{comment.content}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-[hsl(150,8%,64%)]">{comment.articleTitle || "Binh luan bai viet"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
