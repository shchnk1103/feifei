import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";

// 设置 cookie 的过期时间（5天）
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    // 验证 ID token
    if (!idToken) {
      return NextResponse.json({ error: "未提供 ID token" }, { status: 400 });
    }

    // 创建 session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    // 创建响应
    const response = NextResponse.json({ status: "success" });

    // 设置 cookie
    response.cookies.set("session", sessionCookie, {
      maxAge: EXPIRES_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json({ error: "登录失败" }, { status: 401 });
  }
}
