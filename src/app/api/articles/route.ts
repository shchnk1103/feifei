import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { RouteHandlerParams } from "@/types/next-api";
import { Query, CollectionReference } from "firebase-admin/firestore";

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
export async function POST(request: NextRequest, context: RouteHandlerParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const articleData = await request.json();

    // 验证必要字段
    if (!articleData.title || !articleData.content) {
      return NextResponse.json(
        { error: "标题和内容为必填项" },
        { status: 400 }
      );
    }

    // 准备文章数据
    const article = {
      ...articleData,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: articleData.status || "draft",
      visibility: articleData.visibility || "private",
      allowComments: articleData.allowComments ?? true,
      tags: articleData.tags || [],
      metadata: {
        wordCount: articleData.content.length,
        readingTime: Math.ceil(articleData.content.length / 500),
        views: 0,
        likes: 0,
        ...articleData.metadata,
      },
    };

    // 使用 Firebase Admin SDK
    const docRef = await db.collection("articles").add(article);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      ...article,
    });
  } catch (error) {
    console.error("创建文章失败:", error);
    return NextResponse.json(
      { error: "创建文章失败", details: error },
      { status: 500 }
    );
  }
}

// 获取文章列表
export async function GET(request: NextRequest, context: RouteHandlerParams) {
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
