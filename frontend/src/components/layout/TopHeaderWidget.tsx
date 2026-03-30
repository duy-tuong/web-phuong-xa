"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CloudSun, Loader2 } from "lucide-react";

type TopHeaderWidgetProps = {
  textColor?: string;
  iconColor?: string;
  showDate?: boolean;
  showWeather?: boolean;
};

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number | null;
  };
  current_weather?: {
    temperature?: number | null;
  };
};

export default function TopHeaderWidget({
  textColor = "text-slate-600",
  iconColor = "text-[#1f7a5a]",
  showDate = true,
  showWeather = true,
}: TopHeaderWidgetProps) {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    setCurrentDate(now.toLocaleDateString("vi-VN", options));

    if (!showWeather) {
      setIsLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=10.46&longitude=105.63&current=temperature_2m&current_weather=true&timezone=auto",
        );

        if (!res.ok) {
          throw new Error(`Weather request failed with status ${res.status}`);
        }

        const data = (await res.json()) as OpenMeteoResponse;
        const temperature =
          typeof data.current?.temperature_2m === "number"
            ? data.current.temperature_2m
            : typeof data.current_weather?.temperature === "number"
              ? data.current_weather.temperature
              : null;

        setTemp(temperature !== null ? Math.round(temperature) : null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
        setTemp(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchWeather();

    const weatherInterval = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherInterval);
  }, [showWeather]);

  return (
    <div className={`flex items-center gap-3 text-sm font-medium ${textColor}`}>
      {showDate && currentDate ? (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <CalendarDays className="h-4 w-4 opacity-80" />
          <span>{currentDate}</span>
        </div>
      ) : null}

      {showDate && showWeather ? <span className="h-4 w-px bg-white/20" /> : null}

      {showWeather ? (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <CloudSun className={`h-4 w-4 ${iconColor}`} />
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
              <span className="text-xs opacity-70">Đang cập nhật...</span>
            </div>
          ) : temp !== null ? (
            <span>Cao Lãnh {temp}°C</span>
          ) : (
            <span className="text-xs opacity-50">N/A</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
