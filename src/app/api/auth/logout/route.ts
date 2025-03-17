import { NextResponse } from "next/server";

/**
 * 登出 API 路由
 *
 * 此 API 用于清除 Firebase 认证的 session cookie
 *
 * @route POST /api/auth/logout
 * @group Authentication - 用户认证相关接口
 *
 * @returns {Object} 200 - 登出成功
 * @returns {Error} 500 - 服务器错误
 *
 * @example
 * // 清除 Firebase Session Cookie
 * const response = await fetch('/api/auth/logout', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' }
 * });
 */
export async function POST() {
  try {
    // 创建响应
    const response = NextResponse.json({ success: true });

    // 删除 cookie
    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("登出失败:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
