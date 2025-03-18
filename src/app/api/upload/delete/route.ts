import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Storage } from "firebase-admin/storage";

/**
 * 处理图片删除请求
 *
 * @route POST /api/upload/delete
 * @param {Request} request - 请求对象，包含要删除的文件路径
 * @returns {NextResponse} 返回删除结果
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权操作" }, { status: 401 });
    }

    // 解析请求数据
    const data = await request.json();
    const { path } = data;

    if (!path) {
      return NextResponse.json({ error: "缺少文件路径" }, { status: 400 });
    }

    console.log(`准备删除文件: ${path}`);

    try {
      // 获取文件引用
      const fileRef = (adminStorage as Storage).bucket().file(path);

      // 检查文件是否存在
      const [exists] = await fileRef.exists();
      if (!exists) {
        console.log(`文件不存在: ${path}`);
        return NextResponse.json({
          success: false,
          message: "文件不存在",
        });
      }

      // 删除文件
      await fileRef.delete();

      console.log(`文件已成功删除: ${path}`);

      return NextResponse.json({
        success: true,
        message: "文件已成功删除",
      });
    } catch (deleteError) {
      console.error("删除文件过程中错误:", deleteError);
      return NextResponse.json(
        {
          error: "删除文件失败",
          details:
            deleteError instanceof Error ? deleteError.message : "未知错误",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("处理删除请求时出错:", error);
    return NextResponse.json(
      {
        error: "处理删除请求失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
