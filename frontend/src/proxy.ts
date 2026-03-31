// Đây là middleware dùng để kiểm tra xác thực cho các trang admin. Nếu token hợp lệ, cho phép truy cập; nếu không, chuyển hướng đến trang đăng nhập.
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ADMIN_ROLES = new Set<string>(["Admin", "Editor"]);
const RESTRICTED_EDITOR_PATHS: string[] = [
  "/admin/users",
  "/admin/roles",
  "/admin/logs",
];

export function proxy(request: NextRequest) {
  const isDevBypassEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.BYPASS_ADMIN_AUTH === "true";

  if (isDevBypassEnabled) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("admin_token")?.value;
  const role = request.cookies.get("admin_role")?.value;

  if (token && role && ALLOWED_ADMIN_ROLES.has(role)) {
    if (
      role === "Editor" &&
      RESTRICTED_EDITOR_PATHS.some((path: string) => pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);

  if (token && (!role || !ALLOWED_ADMIN_ROLES.has(role))) {
    response.cookies.set("admin_token", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
    response.cookies.set("admin_role", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
