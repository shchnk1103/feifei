import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerAuthSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { Query } from "firebase-admin/firestore";
import {
  Article,
  ArticleStatus,
  ArticleVisibility,
} from "@/modules/blog/types/blog";

// 定义API返回的文章类型
export interface ApiArticle extends Omit<Article, "id"> {
  id: string;
}

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

    // 验证用户信息完整性
    if (!session.user.id || !session.user.name) {
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

    // 验证必要字段
    const validationErrors: string[] = [];
    if (!articleData.title) {
      validationErrors.push("标题不能为空");
    }
    if (!articleData.content) {
      validationErrors.push("内容不能为空");
    }
    if (validationErrors.length > 0) {
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
        email: session.user.email || null,
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

    // 使用 Firebase Admin SDK
    const docRef = await db.collection("articles").add(article);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...article,
      },
    });
  } catch (error) {
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

/**
 * 获取文章列表
 *
 * @route GET /api/articles
 */
export async function GET(request: NextRequest) {
  try {
    console.log("开始处理文章列表请求");

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as ArticleStatus | null;
    const visibility = searchParams.get(
      "visibility"
    ) as ArticleVisibility | null;
    const authorId = searchParams.get("authorId");
    const tag = searchParams.get("tag");

    console.log("查询参数:", {
      page,
      limit,
      status,
      visibility,
      authorId,
      tag,
    });

    // 初始化查询
    let query: Query = db.collection("articles");

    // 添加过滤条件
    if (status) {
      console.log("添加状态过滤:", status);
      query = query.where("status", "==", status);
    }
    if (visibility) {
      console.log("添加可见性过滤:", visibility);
      query = query.where("visibility", "==", visibility);
    }
    if (authorId) {
      console.log("添加作者ID过滤:", authorId);
      query = query.where("author.id", "==", authorId);
    }
    if (tag) {
      console.log("添加标签过滤:", tag);
      query = query.where("tags", "array-contains", tag);
    }

    // 添加排序
    console.log("添加创建时间排序");
    query = query.orderBy("createdAt", "desc");

    // 添加分页
    const articlesQuery = query.limit(limit);

    // 执行查询
    let articles: ApiArticle[] = [];
    let snapshot;

    try {
      console.log("执行查询...");
      snapshot = await articlesQuery.get();
      articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ApiArticle[];
      console.log("查询成功，获取文章数量:", articles.length);
    } catch (queryError) {
      console.error("查询失败:", queryError);

      // 检查是否是索引错误
      const errorMessage =
        queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage.includes("index")) {
        console.error("需要创建索引:", errorMessage);
        return NextResponse.json(
          {
            error: "需要创建索引",
            message: "请按照错误信息中的链接创建索引",
            details: errorMessage,
          },
          { status: 500 }
        );
      }

      // 尝试不带过滤条件和排序获取文章
      try {
        console.log("尝试简单查询...");
        const simpleSnapshot = await db
          .collection("articles")
          .limit(limit)
          .get();
        articles = simpleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ApiArticle[];
        console.log("简单查询成功，获取文章数量:", articles.length);
      } catch (simpleError) {
        console.error("简单查询也失败:", simpleError);
        throw queryError; // 重新抛出原始错误
      }
    }

    // 获取总数
    let total = 0;
    try {
      console.log("获取总数...");
      const totalSnapshot = await query.count().get();
      total = totalSnapshot.data().count;
      console.log("总数:", total);
    } catch (countError) {
      console.error("获取总数失败:", countError);
      total = articles.length; // 回退到已获取的文章数量
    }

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("处理文章列表请求失败:", error);
    return NextResponse.json(
      {
        error: "获取文章列表失败",
        details: error instanceof Error ? error.message : String(error),
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
