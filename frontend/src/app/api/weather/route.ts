import { NextResponse } from "next/server";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number | null;
  };
  current_weather?: {
    temperature?: number | null;
  };
};

const DEFAULT_LOCATION = "Cao L\u00e3nh";
const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=10.46&longitude=105.63&current=temperature_2m&current_weather=true&timezone=auto";

export async function GET() {
  try {
    const response = await fetch(WEATHER_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Unable to fetch weather data" }, { status: 502 });
    }

    const data = (await response.json()) as OpenMeteoResponse;
    const temperature =
      typeof data.current?.temperature_2m === "number"
        ? data.current.temperature_2m
        : typeof data.current_weather?.temperature === "number"
          ? data.current_weather.temperature
          : null;

    return NextResponse.json({
      location: DEFAULT_LOCATION,
      temperature: temperature !== null ? Math.round(temperature) : null,
    });
  } catch {
    return NextResponse.json({ message: "Weather service unavailable" }, { status: 502 });
  }
}
