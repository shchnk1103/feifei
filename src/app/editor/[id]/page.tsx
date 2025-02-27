"use client";

import React, { use } from "react"; // 导入 use
import { ArticleEditor } from "@/components/editor/ArticleEditor";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 解包 params Promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // 从本地存储获取文章数据
  const article = (() => {
    // 检查是否是客户端环境
    if (typeof window !== "undefined") {
      // 尝试从本地存储中获取文章
      const storedArticle = localStorage.getItem(`article-${id}`);
      if (storedArticle) {
        return JSON.parse(storedArticle);
      }
    }

    // 如果找不到文章，返回默认文章结构
    return {
      id,
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
  })();

  // 渲染编辑器组件
  return <ArticleEditor initialArticle={article} />;
}
