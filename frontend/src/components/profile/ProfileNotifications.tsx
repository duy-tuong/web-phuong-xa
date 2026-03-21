"use client";

import { Bell, CheckCircle2, MessageCircleWarning } from "lucide-react";

const notifications = [
  {
    title: "Yêu cầu bổ sung hồ sơ HS-2023-7543",
    description:
      "Hồ sơ Cấp bản sao trích lục hộ tịch của bạn cần bổ sung thêm Bản sao CMND/CCCD có chứng thực. Vui lòng cập nhật trước ngày 20/10/2023.",
    time: "Hôm qua, 14:30",
    variant: "info" as const,
  },
  {
    title: "Hồ sơ HS-2023-6102 đã hoàn thành",
    description:
      "Hồ sơ Xác nhận tình trạng hôn nhân đã được xử lý xong. Vui lòng đến Bộ phận Một cửa UBND Phường Cao Lãnh để nhận kết quả.",
    time: "05/10/2023, 09:15",
    variant: "success" as const,
  },
];

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

export default function ProfileNotifications() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-bold text-slate-900">Thông báo mới</h3>
      </div>

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
    </div>
  );
}
