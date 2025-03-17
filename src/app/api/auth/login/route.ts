import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";

/**
 * 登录 API 路由
 *
 * 此 API 用于处理 Firebase 认证的 session cookie 设置
 *
 * @route POST /api/auth/login
 * @group Authentication - 用户认证相关接口
 *
 * @param {Object} request.body
 * @param {string} request.body.idToken - Firebase ID Token
 *
 * @returns {Object} 200 - 登录成功
 * @returns {Error} 400 - 请求参数错误
 * @returns {Error} 401 - 认证失败
 * @returns {Error} 500 - 服务器错误
 *
 * @example
 * // 设置 Firebase Session Cookie
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     idToken: 'firebase-id-token'
 *   })
 * });
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    // 验证 ID token
    if (!idToken) {
      return NextResponse.json({ error: "未提供 ID token" }, { status: 400 });
    }

    // 设置 session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // 创建响应
    const response = NextResponse.json({ success: true });

    // 设置 cookie
    response.cookies.set({
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
