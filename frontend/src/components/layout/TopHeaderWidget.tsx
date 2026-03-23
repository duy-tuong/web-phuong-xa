"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CloudSun, Loader2 } from "lucide-react";

type TopHeaderWidgetProps = {
  textColor?: string;
  iconColor?: string;
  showDate?: boolean;
};

export default function TopHeaderWidget({
  textColor = "text-slate-600",
  iconColor = "text-[#1f7a5a]",
  showDate = true,
}: TopHeaderWidgetProps) {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Xử lý Ngày tháng thực tế
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = now.toLocaleDateString("vi-VN", options);
    setCurrentDate(formattedDate);

    // 2. Xử lý Thời tiết từ Open-Meteo (Cao Lãnh: 10.46, 105.63)
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=10.46&longitude=105.63&current_weather=true"
        );
        const data = await res.json();
        
        if (data && data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh thời tiết mỗi 15 phút
    const weatherInterval = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <div className={`flex items-center gap-3 text-sm font-medium ${textColor}`}>
      {/* Ngày tháng */}
      {showDate && currentDate && (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <CalendarDays className="h-4 w-4 opacity-80" />
          <span>{currentDate}</span>
        </div>
      )}

      {showDate && <span className="h-4 w-px bg-white/20" />}

      {/* Thời tiết */}
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <CloudSun className={`h-4 w-4 ${iconColor}`} />
        {isLoading ? (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
            <span className="text-xs opacity-70">Updating...</span>
          </div>
        ) : temp !== null ? (
          <span>Cao Lãnh {temp}°C</span>
        ) : (
          <span className="text-xs opacity-50">N/A</span>
        )}
      </div>
    </div>
  );
}
