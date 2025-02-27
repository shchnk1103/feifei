"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewArticlePage() {
  const router = useRouter();

  useEffect(() => {
    // 创建一个临时文章 ID (不需要实际的 API 请求)
    const createTempArticle = () => {
      // 生成一个临时ID
      const tempId = `draft-${Date.now()}`;

      // 将临时文章数据存储在本地存储中，以便后续使用
      const tempArticle = {
        id: tempId,
        title: "未命名文章",
        blocks: [
          {
            id: `block-${Date.now()}`,
            type: "text",
            content: "",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
      };

      // 存入本地存储
      localStorage.setItem(`article-${tempId}`, JSON.stringify(tempArticle));

      // 重定向到编辑器页面
      router.push(`/editor/${tempId}`);
    };

    // 执行创建临时文章
    createTempArticle();
  }, [router]);

  // 显示加载状态
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>创建文章中，请稍候...</p>
    </div>
  );
}
