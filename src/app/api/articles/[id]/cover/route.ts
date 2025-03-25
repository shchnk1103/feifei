import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminStorage } from "@/lib/firebase/admin";
import { Storage } from "firebase-admin/storage";
import { NextRequest } from "next/server";

// 参数类型，与Next.js App Router兼容
type Props = {
  params: {
    id: string;
  };
};

/**
 * 获取文章封面图片
 *
 * @route GET /api/articles/[id]/cover
 * @param request 请求对象
 * @param context 上下文对象，包含路由参数
 * @returns 返回封面图片URL
 */
export async function GET(request: NextRequest, props: Props) {
  try {
    // 允许公开访问封面图片
    const { id } = props.params;
    if (!id) {
      return NextResponse.json({ error: "缺少文章ID" }, { status: 400 });
    }

    // 构建可能的文件路径模式
    const filePattern = `articles/${id}/cover`;

    try {
      // 获取匹配的文件
      const [files] = await (adminStorage as Storage).bucket().getFiles({
        prefix: filePattern,
      });

      if (files.length === 0) {
        console.log(`未找到文章 ${id} 的封面图片`);
        return NextResponse.json({
          success: false,
          message: "未找到封面图片",
        });
      }

      // 获取第一个匹配文件
      const file = files[0];

      // 获取签名URL
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // 设置一个很远的过期时间
      });

      console.log(`获取到文章 ${id} 的封面图片: ${url}`);

      return NextResponse.json({
        success: true,
        url: url,
      });
    } catch (error) {
      console.error("获取封面图片过程中错误:", error);
      return NextResponse.json(
        {
          error: "获取封面图片失败",
          details: error instanceof Error ? error.message : "未知错误",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("处理获取封面请求时出错:", error);
    return NextResponse.json(
      {
        error: "处理请求失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

/**
 * 更新文章封面图片
 *
 * @route POST /api/articles/[id]/cover
 * @param request 请求对象
 * @param context 上下文对象，包含路由参数
 * @returns 成功或失败的响应
 */
export async function POST(request: NextRequest, props: Props) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权操作" }, { status: 401 });
    }

    const { id } = props.params;
    if (!id) {
      return NextResponse.json({ error: "缺少文章ID" }, { status: 400 });
    }

    // 获取请求体
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "缺少图片URL" }, { status: 400 });
    }

    // 更新数据库中的文章封面字段
    // 这里应该添加实际的数据库更新逻辑
    console.log(`为文章 ${id} 更新封面图片: ${url}`);

    return NextResponse.json({
      success: true,
      message: "封面图片已更新",
    });
  } catch (error) {
    console.error("更新封面图片时出错:", error);
    return NextResponse.json(
      {
        error: "更新封面图片失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

/**
 * 删除文章封面图片
 *
 * @route DELETE /api/articles/[id]/cover
 * @param request 请求对象
 * @param context 上下文对象，包含路由参数
 * @returns 成功或失败的响应
 */
export async function DELETE(request: NextRequest, props: Props) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权操作" }, { status: 401 });
    }

    const { id } = props.params;
    if (!id) {
      return NextResponse.json({ error: "缺少文章ID" }, { status: 400 });
    }

    // 删除数据库中的文章封面字段
    // 这里应该添加实际的数据库更新逻辑
    console.log(`为文章 ${id} 删除封面图片`);

    return NextResponse.json({
      success: true,
      message: "封面图片已删除",
    });
  } catch (error) {
    console.error("删除封面图片时出错:", error);
    return NextResponse.json(
      {
        error: "删除封面图片失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
