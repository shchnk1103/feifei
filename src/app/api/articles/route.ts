import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerAuthSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { Query } from "firebase-admin/firestore";

/**
 * 文章 API 路由
 *
 * 提供文章的 CRUD 操作接口
 *
 * @module api/articles
 */

/**
 * 创建新文章
 *
 * @route POST /api/articles
 * @requires 用户认证
 *
 * @param {Request} request - 包含文章数据的请求对象
 * @returns {Promise<NextResponse>} 返回创建的文章数据或错误信息
 *
 * @throws {401} 未授权访问
 * @throws {400} 请求数据无效
 * @throws {500} 服务器内部错误
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/articles', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     title: '文章标题',
 *     content: '文章内容',
 *     // ... 其他文章字段
 *   })
 * });
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    console.log("当前会话信息：", {
      session,
      user: session?.user,
      userId: session?.user?.id,
    });

    if (!session?.user) {
      console.error("未授权访问：缺少用户会话");
      return NextResponse.json(
        {
          error: "未授权访问",
          details: "用户未登录或会话已过期",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // 验证用户信息完整性
    if (!session.user.id || !session.user.name) {
      console.error("用户信息不完整：", session.user);
      return NextResponse.json(
        {
          error: "用户信息不完整",
          details: "用户ID或名称缺失",
          code: "INVALID_USER",
        },
        { status: 400 }
      );
    }

    const articleData = await request.json();
    console.log("收到创建文章请求：", {
      title: articleData.title,
      description: articleData.description,
      content: articleData.content,
      author: articleData.author,
      status: articleData.status,
    });

    // 验证必要字段
    const validationErrors = [];
    if (!articleData.title) {
      validationErrors.push("标题不能为空");
    }
    if (!articleData.content) {
      validationErrors.push("内容不能为空");
    }
    if (validationErrors.length > 0) {
      console.error("文章数据验证失败：", {
        validationErrors,
        articleData: {
          title: articleData.title,
          description: articleData.description,
          content: articleData.content,
        },
      });
      return NextResponse.json(
        {
          error: "数据验证失败",
          validationErrors,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // 准备文章数据，确保所有字段都有有效值
    const article = {
      title: articleData.title,
      description: articleData.description || "",
      content: articleData.content,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email || null, // 如果 email 不存在，使用 null
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: articleData.status || "draft",
      visibility: articleData.visibility || "private",
      allowComments: articleData.allowComments ?? true,
      tags: articleData.tags || [],
      category: articleData.category || null,
      metadata: {
        wordCount: articleData.content.length,
        readingTime: Math.ceil(articleData.content.length / 500),
        views: 0,
        likes: 0,
        ...(articleData.metadata || {}),
      },
    };

    console.log("准备保存文章数据：", {
      title: article.title,
      author: article.author,
      status: article.status,
      visibility: article.visibility,
    });

    // 使用 Firebase Admin SDK
    const docRef = await db.collection("articles").add(article);
    console.log("文章保存成功，ID：", docRef.id);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...article,
      },
    });
  } catch (error) {
    console.error("创建文章失败，服务器错误：", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "创建文章失败",
        details: error instanceof Error ? error.message : String(error),
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const visibility = searchParams.get("visibility");
    const authorId = searchParams.get("authorId");
    const tag = searchParams.get("tag");

    let query: Query = db.collection("articles");

    // 添加过滤条件
    if (status) {
      query = query.where("status", "==", status);
    }
    if (visibility) {
      query = query.where("visibility", "==", visibility);
    }
    if (authorId) {
      query = query.where("author.id", "==", authorId);
    }
    if (tag) {
      query = query.where("tags", "array-contains", tag);
    }

    // 添加排序
    query = query.orderBy("createdAt", "desc");

    // 添加分页
    const startAt = (page - 1) * limit;
    const snapshot = await query.limit(limit).startAfter(startAt).get();

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 获取总数
    const totalSnapshot = await query.count().get();
    const total = totalSnapshot.data().count;

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json(
      { error: "获取文章列表失败", details: error },
      { status: 500 }
    );
  }
}
