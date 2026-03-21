import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isDevBypassEnabled =
    process.env.NODE_ENV !== "production" && process.env.BYPASS_ADMIN_AUTH === "true";

  if (isDevBypassEnabled) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
