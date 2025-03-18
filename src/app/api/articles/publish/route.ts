import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerAuthSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

/**
 * 发布文章 API 路由
 *
 * 将草稿文章发布为公开文章
 *
 * @route POST /api/articles/publish
 * @requires 用户认证
 *
 * @param {Request} request - 包含文章ID和发布数据的请求对象
 * @returns {Promise<NextResponse>} 返回发布结果或错误信息
 *
 * @throws {401} 未授权访问
 * @throws {400} 请求数据无效
 * @throws {403} 没有权限发布
 * @throws {500} 服务器内部错误
 */
export async function POST(request: NextRequest) {
  try {
    // 获取用户会话，验证用户是否已登录
    const session = await getServerAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "未授权访问",
          details: "用户未登录或会话已过期",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // 获取请求数据
    const { articleId, ...publishData } = await request.json();

    // 验证必要字段
    if (!articleId) {
      return NextResponse.json(
        {
          error: "数据验证失败",
          details: "文章ID不能为空",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // 获取文章数据
    const articleRef = db.collection("articles").doc(articleId);
    const articleSnap = await articleRef.get();

    if (!articleSnap.exists) {
      return NextResponse.json(
        {
          error: "文章不存在",
          details: "无法找到指定的文章",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const articleData = articleSnap.data();

    // 验证用户是否为文章作者
    if (articleData?.author?.id !== session.user.id) {
      return NextResponse.json(
        {
          error: "权限不足",
          details: "只有文章作者才能发布此文章",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // 准备更新数据
    const updateData = {
      status: "published",
      visibility: publishData.visibility || "public",
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      ...publishData,
    };

    // 更新文章状态
    await articleRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "文章发布成功",
      data: {
        id: articleId,
        ...updateData,
      },
    });
  } catch (error) {
    console.error("发布文章失败:", error);

    return NextResponse.json(
      {
        error: "发布文章失败",
        details: error instanceof Error ? error.message : String(error),
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
