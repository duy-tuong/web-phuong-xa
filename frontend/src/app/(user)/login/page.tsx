//  import và render component LoginPageClient 
// (tách riêng để tận dụng Next.js server/client component).
import LoginPageClient from "./page-client";
// người dùng truy cập vào /login sẽ thấy giao diện đăng nhập, sau khi đăng nhập thành công sẽ được chuyển hướng về trang chủ hoặc trang admin tùy role.
export default function LoginPage() {
  return <LoginPageClient />;
}
