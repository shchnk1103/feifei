import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { RouteHandlerParams } from "@/types/next-api";

// 更新文章
export async function PATCH(request: NextRequest, context: RouteHandlerParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "文章ID不能为空" }, { status: 400 });
    }

    const updates = await request.json();

    // 添加更新时间戳
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    // 使用 Firebase Admin SDK
    const articleRef = db.collection("articles").doc(id);
    await articleRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("更新文章失败:", error);
    return NextResponse.json({ error: "更新文章失败" }, { status: 500 });
  }
}

/**
 * 获取单个文章的接口
 */
export async function GET(request: NextRequest, context: RouteHandlerParams) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "文章ID不能为空" }, { status: 400 });
    }

    console.log(`正在通过API获取文章[${id}]`);
    const doc = await db.collection("articles").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 返回带ID的文章数据
    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error(`获取文章出错:`, error);
    return NextResponse.json(
      { error: "获取文章失败", message: (error as Error).message },
      { status: 500 }
    );
  }
}
