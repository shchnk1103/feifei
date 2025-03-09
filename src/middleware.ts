import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 定义不需要验证的路由
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/about",
  "/api/auth/login",
  "/api/auth/register",
];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 如果没有session，重定向到登录页面
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set(
      "x-middleware-cache",
      "no-cache, no-store, max-age=0, must-revalidate"
    );
    return response;
  }

  return NextResponse.next();
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api/auth (登录注册接口)
     * - _next (Next.js 系统文件)
     * - public (静态文件)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
