import { db } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiArticle } from "@/app/api/articles/route";

// 参数类型，与Next.js App Router兼容
type Props = {
  params: {
    id: string;
  };
};

// 更新文章
export async function PUT(request: NextRequest, props: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { id } = props.params;

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

    return NextResponse.json({ message: "文章更新功能待实现" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "更新文章失败",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * 获取单个文章的接口
 */
export async function GET(request: NextRequest, props: Props) {
  try {
    const { id } = props.params;

    // 检查文章ID是否有效
    if (!id) {
      return NextResponse.json(
        {
          error: "无效的文章ID",
          code: "INVALID_ID",
        },
        { status: 400 }
      );
    }

    console.log(`获取文章 ID: ${id}`);

    // 从Firestore获取文章
    const docRef = db.collection("articles").doc(id);
    const docSnap = await docRef.get();

    // 如果文章不存在
    if (!docSnap.exists) {
      return NextResponse.json(
        {
          error: "文章不存在",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // 返回文章数据
    const articleData = docSnap.data();
    const article: ApiArticle = {
      id: docSnap.id,
      ...articleData,
    } as ApiArticle;

    return NextResponse.json(article);
  } catch (error) {
    console.error("获取文章失败:", error);
    return NextResponse.json(
      {
        error: "获取文章失败",
        details: error instanceof Error ? error.message : String(error),
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// 删除文章
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { id } = props.params;

    if (!id) {
      return NextResponse.json({ error: "文章ID不能为空" }, { status: 400 });
    }

    // ... 现有删除文章的代码 ...
    return NextResponse.json({ message: "文章删除功能待实现" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "删除文章失败",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
