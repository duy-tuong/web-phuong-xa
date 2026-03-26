// Đây là middleware dùng để kiểm tra xác thực cho các trang admin. Nếu token hợp lệ, cho phép truy cập; nếu không, chuyển hướng đến trang đăng nhập.
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
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
