import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * 获取认证令牌
 *
 * @route GET /api/auth/token
 * @requires 用户认证
 *
 * @returns {Promise<NextResponse>} 返回认证令牌
 *
 * @throws {401} 未授权访问
 * @throws {500} 服务器内部错误
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问", message: "请先登录" },
        { status: 401 }
      );
    }

    // 从 session 中获取用户信息
    const { user } = session;

    // 生成一个简单的令牌（实际应用中应该使用更安全的方式）
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({ token });
  } catch (error) {
    console.error("获取认证令牌失败:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        message: "获取认证令牌失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
