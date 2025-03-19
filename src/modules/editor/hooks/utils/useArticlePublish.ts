import { useCallback } from "react";
import { Article, ArticleVisibility } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import { ArticleContent } from "../types/articleEditor";

type UseArticlePublishProps = {
  article: Article | null;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];
  saveArticleToDb: () => Promise<void>;
  setInitialLoadedData: (data: ArticleContent) => void;
  setSaveStatus: (status: "saved" | "saving" | "error") => void;
  updateDebugInfo: (changed: boolean) => void;
};

/**
 * 处理文章发布功能的hook
 */
export function useArticlePublish({
  article,
  title,
  blocks,
  coverImage,
  tags,
  saveArticleToDb,
  setInitialLoadedData,
  setSaveStatus,
  updateDebugInfo,
}: UseArticlePublishProps) {
  /**
   * 处理发布文章
   */
  const publishArticle = useCallback(async () => {
    if (!article) return;

    console.log("[调试] 开始发布文章流程");

    try {
      setSaveStatus("saving");

      // 先保存最新内容到数据库
      console.log("[调试] 发布前保存文章到数据库");
      await saveArticleToDb();

      // 创建发布对象
      const publishData = {
        articleId: article.id,
        title,
        description:
          blocks.find((b) => b.type === "text")?.content.slice(0, 150) || "",
        imageSrc: coverImage,
        articleContent: {
          blocks,
          version: article.articleContent?.version || 1,
        },
        tags,
        visibility: "public" as ArticleVisibility,
      };

      console.log("[调试] 开始调用发布API", publishData);

      // 调用发布API
      const response = await fetch("/api/articles/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[调试] 发布API返回错误:", errorData);
        throw new Error(errorData.error || "发布失败");
      }

      await response.json(); // 消费响应但不使用结果
      console.log("[调试] 发布API调用成功");

      // 更新本地状态
      setInitialLoadedData({
        title,
        blocks,
        imageSrc: coverImage,
        tags,
      });

      setSaveStatus("saved");
      console.log("[调试] 文章发布成功");
      alert("文章发布成功！");

      // 使用setTimeout异步更新调试信息
      setTimeout(() => {
        updateDebugInfo(false);
      }, 0);
    } catch (e) {
      console.error("[调试] 发布文章失败:", e);
      setSaveStatus("error");
      alert(e instanceof Error ? e.message : "发布失败，请稍后重试");

      // 使用setTimeout异步更新调试信息
      setTimeout(() => {
        updateDebugInfo(true);
      }, 0);
    }
  }, [
    article,
    title,
    blocks,
    coverImage,
    tags,
    saveArticleToDb,
    setInitialLoadedData,
    setSaveStatus,
    updateDebugInfo,
  ]);

  return { publishArticle };
}
