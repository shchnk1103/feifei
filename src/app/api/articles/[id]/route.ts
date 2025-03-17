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

// 获取文章
export async function GET(request: NextRequest, context: RouteHandlerParams) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "文章ID不能为空" }, { status: 400 });
    }

    const articleRef = db.collection("articles").doc(id);
    const articleSnap = await articleRef.get();

    if (!articleSnap.exists) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    return NextResponse.json(articleSnap.data());
  } catch (error) {
    console.error("获取文章失败:", error);
    return NextResponse.json({ error: "获取文章失败" }, { status: 500 });
  }
}
