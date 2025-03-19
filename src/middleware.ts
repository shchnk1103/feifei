import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/logger";

// 定义不需要验证的路由
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/about",
  "/api/auth/login",
  "/api/auth/register",
];

// 定义不需要验证的API路由正则表达式
const publicApiPatterns = [
  /^\/api\/articles$/, // 获取文章列表
  /^\/api\/articles\/[^/]+$/, // 获取单篇文章详情
  /^\/api\/articles\/[^/]+\/cover$/, // 获取文章封面图片
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 检查是否匹配公开API路由模式
  for (const pattern of publicApiPatterns) {
    if (pattern.test(pathname)) {
      return NextResponse.next();
    }
  }

  try {
    // 使用 NextAuth 的 getToken 方法检查认证状态
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 如果没有 token，重定向到登录页面
    if (!token) {
      logger.debug("未找到认证 token，重定向到登录页面", { pathname });
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set(
        "x-middleware-cache",
        "no-cache, no-store, max-age=0, must-revalidate"
      );
      return response;
    }

    // 检查管理员权限（对于特定路径）
    if (pathname.startsWith("/editor") && token.role !== "admin") {
      logger.warn("非管理员用户尝试访问编辑器", { pathname, role: token.role });
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // 如果出现错误，记录错误并重定向到登录页面
    logger.error("中间件认证检查失败", {
      error,
      pathname,
      message: error instanceof Error ? error.message : String(error),
    });
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set(
      "x-middleware-cache",
      "no-cache, no-store, max-age=0, must-revalidate"
    );
    return response;
  }
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
