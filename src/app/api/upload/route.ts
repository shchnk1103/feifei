import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Storage } from "firebase-admin/storage";

interface FirebaseError extends Error {
  code?: string;
  response?: {
    data?: Record<string, unknown>;
  };
  status?: number;
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权操作" }, { status: 401 });
    }

    // 验证存储桶是否存在
    try {
      const bucketName = (adminStorage as Storage).bucket().name;
      console.log("验证存储桶是否存在...", bucketName);
      console.log(
        "存储桶完整信息:",
        JSON.stringify((adminStorage as Storage).bucket(), null, 2)
      );

      const [bucketExists] = await (adminStorage as Storage).bucket().exists();
      if (!bucketExists) {
        console.error("存储桶不存在，无法继续上传");
        return NextResponse.json(
          {
            error: "存储配置错误：存储桶不存在",
            bucket: bucketName,
          },
          { status: 500 }
        );
      }
      console.log("存储桶存在，继续上传流程");
    } catch (bucketError) {
      console.error("检查存储桶时出错:", bucketError);
      return NextResponse.json(
        {
          error: "无法验证存储桶",
          details:
            bucketError instanceof Error ? bucketError.message : "未知错误",
        },
        { status: 500 }
      );
    }

    // 解析请求数据
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const articleId = formData.get("articleId") as string;

    if (!file) {
      return NextResponse.json({ error: "没有找到文件" }, { status: 400 });
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "只允许上传图片文件" },
        { status: 400 }
      );
    }

    // 限制文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "图片大小不能超过5MB" },
        { status: 400 }
      );
    }

    // 创建唯一的文件路径
    const fileExt = file.name.split(".").pop();
    const filePath = articleId
      ? `articles/${articleId}/cover.${fileExt}`
      : `articles/temp/${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;

    console.log(`准备上传文件到路径: ${filePath}`);
    console.log(`存储桶信息: ${(adminStorage as Storage).bucket().name}`);

    try {
      // 将文件内容转换为Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("开始使用Admin SDK上传文件...");
      // 使用Admin SDK上传文件
      const fileRef = (adminStorage as Storage).bucket().file(filePath);

      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      console.log("文件上传成功，正在获取下载URL...");

      // 获取下载URL
      const [downloadURL] = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // 设置一个很远的过期时间
      });

      console.log(`获取到下载URL: ${downloadURL}`);

      // 返回上传成功和下载URL
      return NextResponse.json({
        url: downloadURL,
        success: true,
        message: "图片上传成功",
      });
    } catch (uploadError: unknown) {
      console.error(
        "Firebase上传过程中错误:",
        JSON.stringify(uploadError, null, 2)
      );
      const errorMessage =
        uploadError instanceof Error ? uploadError.message : "未知错误";
      const errorCode = (uploadError as FirebaseError)?.code || "unknown";
      const errorResponse = (uploadError as FirebaseError)?.response?.data;
      const errorStatus = (uploadError as FirebaseError)?.status;

      return NextResponse.json(
        {
          error: "Firebase存储上传失败",
          details: errorMessage,
          code: errorCode,
          response: errorResponse,
          status: errorStatus,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    return NextResponse.json(
      {
        error: "图片上传失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
