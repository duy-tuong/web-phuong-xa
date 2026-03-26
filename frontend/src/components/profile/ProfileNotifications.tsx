"use client";

import { Bell, CheckCircle2, MessageCircleWarning } from "lucide-react";

import type { Application } from "@/types";

type NotificationItem = {
  title: string;
  description: string;
  time: string;
  variant: "info" | "success";
};

function formatDate(dateValue: string) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function buildNotifications(applications: Application[]): NotificationItem[] {
  return applications.slice(0, 3).map((application) => {
    if (application.status === "done") {
      return {
        title: `Ho so HS-${application.id.padStart(6, "0")} da hoan thanh`,
        description: `${application.serviceName || "Thu tuc"} cua ban da duoc phe duyet. Vui long theo doi email/so dien thoai de nhan huong dan tiep theo.`,
        time: formatDate(application.createdAt),
        variant: "success",
      };
    }

    return {
      title: `Ho so HS-${application.id.padStart(6, "0")} dang duoc xu ly`,
      description: `${application.serviceName || "Thu tuc"} dang o trang thai ${application.status === "processing" ? "dang xu ly" : "cho tiep nhan"}. He thong se cap nhat cho ban khi co thay doi.`,
      time: formatDate(application.createdAt),
      variant: "info",
    };
  });
}

function getNotificationStyles(variant: "info" | "success") {
  if (variant === "success") {
    return {
      wrapper: "border-green-100 bg-white",
      iconWrap: "bg-green-100 text-green-600",
      icon: CheckCircle2,
    };
  }

  return {
    wrapper: "border-slate-100 bg-slate-50",
    iconWrap: "bg-blue-100 text-blue-600",
    icon: MessageCircleWarning,
  };
}

type ProfileNotificationsProps = {
  applications: Application[];
};

export default function ProfileNotifications({ applications }: ProfileNotificationsProps) {
  const notifications = buildNotifications(applications);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-bold text-slate-900">Thong bao moi</h3>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
          Chua co thong bao nao tu he thong.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {notifications.map((notification) => {
            const styles = getNotificationStyles(notification.variant);
            const Icon = styles.icon;

            return (
              <article key={notification.title} className={`flex gap-4 rounded-2xl border p-4 ${styles.wrapper}`}>
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.iconWrap}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{notification.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{notification.description}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">{notification.time}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
