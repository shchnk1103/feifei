import { useEffect } from "react";
import { Article } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import { ArticleContent } from "../types/articleEditor";

type UseArticleLoadProps = {
  article: Article | null;
  loading: boolean;
  setTitle: (title: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setCoverImage: (image: string) => void;
  setTags: (tags: string[]) => void;
  setInitialLoadedData: (data: ArticleContent) => void;
  updateDebugInfo: () => void;
};

/**
 * 处理文章数据加载的hook
 */
export function useArticleLoad({
  article,
  loading,
  setTitle,
  setBlocks,
  setCoverImage,
  setTags,
  setInitialLoadedData,
  updateDebugInfo,
}: UseArticleLoadProps) {
  // 从本地存储或API加载文章数据
  useEffect(() => {
    if (!article || loading) return;

    console.log(`[调试] 开始加载文章数据: ${article.id}`);

    // 尝试从本地存储获取数据
    const savedData = localStorage.getItem(`article-${article.id}`);
    let loadedContent: ArticleContent;

    if (savedData) {
      try {
        // 解析本地存储的数据
        const parsedData = JSON.parse(savedData);
        console.log("[调试] 从本地存储加载文章数据成功");

        // 设置编辑器内容
        setTitle(parsedData.title || article.title || "未命名文章");
        setBlocks(
          parsedData.articleContent?.blocks ||
            article.articleContent?.blocks ||
            []
        );
        setCoverImage(parsedData.imageSrc || article.imageSrc || "");
        setTags(parsedData.tags || article.tags || []);

        // 保存加载的数据用于比较
        loadedContent = {
          title: parsedData.title,
          blocks: parsedData.articleContent?.blocks,
          imageSrc: parsedData.imageSrc,
          tags: parsedData.tags,
        };
      } catch (e) {
        console.error("[调试] 解析本地存储的文章数据失败:", e);

        // 解析失败时使用API数据
        setTitle(article.title || "未命名文章");
        setBlocks(article.articleContent?.blocks || []);
        setCoverImage(article.imageSrc || "");
        setTags(article.tags || []);

        loadedContent = {
          title: article.title || "",
          blocks: article.articleContent?.blocks || [],
          imageSrc: article.imageSrc || "",
          tags: article.tags || [],
        };
      }
    } else {
      console.log("[调试] 本地存储中无文章数据，使用API数据");
      // 没有本地存储时使用API数据
      setTitle(article.title || "未命名文章");
      setBlocks(article.articleContent?.blocks || []);
      setCoverImage(article.imageSrc || "");
      setTags(article.tags || []);

      loadedContent = {
        title: article.title || "",
        blocks: article.articleContent?.blocks || [],
        imageSrc: article.imageSrc || "",
        tags: article.tags || [],
      };
    }

    setInitialLoadedData(loadedContent);
    console.log("[调试] 文章数据加载完成，初始状态已设置");

    // 使用setTimeout来异步更新调试信息，避免循环依赖
    setTimeout(() => {
      updateDebugInfo();
    }, 0);
  }, [
    article,
    loading,
    setTitle,
    setBlocks,
    setCoverImage,
    setTags,
    setInitialLoadedData,
    updateDebugInfo,
  ]);
}
