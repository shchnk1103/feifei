import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDoc, deleteDoc } from "firebase/firestore";

/**
 * 处理删除文章的 POST 请求
 * 接收文章 ID 参数，并从数据库中彻底删除文章
 */
export async function POST(request: Request) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 解析请求体获取文章ID
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: "缺少文章ID" }, { status: 400 });
    }

    // 获取文章信息，验证所有权
    const articlesRef = collection(db, "articles");
    const articleDocRef = doc(articlesRef, articleId);
    const articleDoc = await getDoc(articleDocRef);

    // 验证文章存在
    if (!articleDoc.exists()) {
      return NextResponse.json({
        success: true,
        message: "文章不存在，可能已被删除",
      });
    }

    const article = articleDoc.data();

    // 验证用户权限（只有作者和管理员可以删除文章）
    const isAuthor = article.authorId === session.user.id;
    const isAdmin = session.user.role === "admin";

    console.log(
      `删除文章权限检查: 文章ID=${articleId}, 当前用户ID=${session.user.id}, 文章作者ID=${article.authorId}, 用户角色=${session.user.role}`
    );

    if (!isAuthor && !isAdmin) {
      console.warn(
        `权限拒绝: 用户 ${session.user.id} 尝试删除不属于他的文章 ${articleId}`
      );
      return NextResponse.json(
        {
          error: "没有删除权限",
          details: "只有文章作者或管理员可以删除文章",
          requestedBy: session.user.id,
          articleAuthor: article.authorId,
        },
        { status: 403 }
      );
    }

    // 记录删除操作的执行者
    const deletedBy = isAuthor ? "作者" : "管理员";
    console.log(`文章 ${articleId} 即将被${deletedBy}删除`);

    // 执行删除操作
    await deleteDoc(articleDocRef);

    return NextResponse.json({
      success: true,
      message: "文章已成功删除",
    });
  } catch (error) {
    console.error("删除文章失败:", error);
    return NextResponse.json(
      {
        error: "删除文章失败",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
