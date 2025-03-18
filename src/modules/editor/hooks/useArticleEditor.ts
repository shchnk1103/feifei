"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Block } from "@/modules/editor/types/blocks";
import {
  Article,
  ArticleStatus,
  ArticleVisibility,
} from "@/modules/blog/types/blog";
import { useArticle } from "@/modules/blog/hooks/useArticle";

// 用于更新文章的类型
export type UpdateableArticle = Partial<Omit<Article, "id">> & {
  id: string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  createdAt?: Date | string;
};

// 文章内容类型，用于跟踪变化
export type ArticleContent = {
  title: string;
  blocks: Block[];
  imageSrc: string;
  tags: string[];
};

// 保存状态类型
export type SaveStatus = "saved" | "saving" | "error";

// Hook返回的状态和函数
export type ArticleEditorReturn = {
  // 文章数据
  article: Article;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];

  // UI状态
  loading: boolean;
  error: string | null;
  saveStatus: SaveStatus;
  sidebarOpen: boolean;

  // 事件处理函数
  handleTitleChange: (newTitle: string) => void;
  handleBlocksChange: (newBlocks: Block[]) => void;
  handleCoverImageChange: (imageUrl: string) => void;
  handleTagsChange: (newTags: string[]) => void;
  publishArticle: () => Promise<void>;
  toggleSidebar: (isOpen?: boolean) => void;

  // 辅助函数
  hasContentChanged: () => boolean;
};

/**
 * 文章编辑器自定义Hook
 *
 * 管理文章编辑器的状态和逻辑，包括：
 * - 数据加载和同步
 * - 内容编辑和状态追踪
 * - 自动保存和发布
 *
 * @param initialArticle 初始文章数据
 * @returns 编辑器状态和操作函数
 */
export function useArticleEditor(initialArticle: Article): ArticleEditorReturn {
  // 从API获取文章数据
  const { article, loading, error, updateArticle } = useArticle<
    Article,
    UpdateableArticle
  >(initialArticle.id);

  // ===== 状态管理 =====
  // 编辑内容状态
  const [title, setTitle] = useState<string>(
    initialArticle.title || "未命名文章"
  );
  const [blocks, setBlocks] = useState<Block[]>(
    initialArticle.articleContent?.blocks || []
  );
  const [coverImage, setCoverImage] = useState<string>(
    initialArticle.imageSrc || ""
  );
  const [tags, setTags] = useState<string[]>(initialArticle.tags || []);

  // UI状态
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 记录初始加载的文章数据，用于检测变化
  const [initialLoadedData, setInitialLoadedData] =
    useState<ArticleContent | null>(null);

  // 防抖保存函数的引用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ===== 数据加载 =====
  /**
   * 从本地存储或API加载文章数据
   */
  useEffect(() => {
    if (!article || loading) return;

    // 尝试从本地存储获取数据
    const savedData = localStorage.getItem(`article-${article.id}`);
    let loadedContent: ArticleContent;

    if (savedData) {
      try {
        // 解析本地存储的数据
        const parsedData = JSON.parse(savedData);

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
        console.error("解析本地存储的文章数据失败:", e);

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
  }, [article, loading]);

  // ===== 变更检测与保存逻辑 =====
  /**
   * 检查文章内容是否发生变化
   */
  const hasContentChanged = useCallback(() => {
    if (!initialLoadedData) return false;

    const titleChanged = title !== initialLoadedData.title;
    const blocksChanged =
      JSON.stringify(blocks) !== JSON.stringify(initialLoadedData.blocks);
    const imageChanged = coverImage !== initialLoadedData.imageSrc;
    const tagsChanged =
      JSON.stringify(tags) !== JSON.stringify(initialLoadedData.tags);

    return titleChanged || blocksChanged || imageChanged || tagsChanged;
  }, [title, blocks, coverImage, tags, initialLoadedData]);

  /**
   * 保存文章内容
   */
  const saveArticle = useCallback(async () => {
    if (!article || !initialArticle?.id) return;

    try {
      // 创建更新对象
      const updatedArticle: UpdateableArticle = {
        id: initialArticle.id,
        title,
        imageSrc: coverImage,
        articleContent: {
          blocks,
          version: article?.articleContent?.version || 1,
        },
        tags,
        updatedAt: new Date(),
      };

      // 保存到本地存储
      localStorage.setItem(
        `article-${initialArticle.id}`,
        JSON.stringify(updatedArticle)
      );

      // 调用API保存
      await updateArticle(updatedArticle);

      // 更新初始数据，以便后续比较
      setInitialLoadedData({
        title,
        blocks,
        imageSrc: coverImage,
        tags,
      });

      // 添加延迟以显示保存状态
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 设置为已保存状态
      setSaveStatus("saved");
    } catch (error) {
      console.error("保存文章失败:", error);
      setSaveStatus("error");
    }
  }, [
    article,
    initialArticle?.id,
    title,
    blocks,
    coverImage,
    tags,
    updateArticle,
  ]);

  /**
   * 自动保存功能
   */
  useEffect(() => {
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // 没有变化不需要保存
    if (!initialArticle?.id || !initialLoadedData || !hasContentChanged()) {
      return;
    }

    // 设置状态为保存中
    setSaveStatus("saving");

    // 使用防抖保存
    const newTimeoutId = setTimeout(() => {
      saveArticle();
    }, 1000);

    // 保存定时器ID以便清除
    saveTimeoutRef.current = newTimeoutId;

    // 清理函数
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [
    initialArticle?.id,
    title,
    blocks,
    coverImage,
    tags,
    initialLoadedData,
    hasContentChanged,
    saveArticle,
  ]);

  // ===== 事件处理函数 =====
  /**
   * 处理标题变更
   */
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  /**
   * 处理块内容变更
   */
  const handleBlocksChange = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
  }, []);

  /**
   * 处理封面图变更
   */
  const handleCoverImageChange = useCallback((newImage: string) => {
    setCoverImage(newImage);
  }, []);

  /**
   * 处理标签变更
   */
  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  /**
   * 切换侧边栏
   */
  const toggleSidebar = useCallback(
    (isOpen?: boolean) => {
      setSidebarOpen(isOpen !== undefined ? isOpen : !sidebarOpen);
    },
    [sidebarOpen]
  );

  /**
   * 处理发布文章
   */
  const publishArticle = useCallback(async () => {
    if (!article) return;

    try {
      setSaveStatus("saving");

      // 创建发布对象
      const publishData: UpdateableArticle = {
        id: article.id,
        title,
        description:
          blocks.find((b) => b.type === "text")?.content.slice(0, 150) || "",
        imageSrc: coverImage,
        articleContent: {
          ...article.articleContent,
          blocks,
        },
        tags,
        status: "published" as ArticleStatus,
        publishedAt: new Date(),
        visibility: "public" as ArticleVisibility,
      };

      // 调用API发布
      await updateArticle(publishData);

      setSaveStatus("saved");
      alert("文章发布成功！");
    } catch (e) {
      console.error("Error publishing article:", e);
      setSaveStatus("error");
      alert("发布失败，请稍后重试");
    }
  }, [article, title, blocks, coverImage, tags, updateArticle]);

  // 返回状态和函数
  return {
    // 状态
    article: article || initialArticle,
    title,
    blocks,
    coverImage,
    tags,
    saveStatus,
    sidebarOpen,
    loading,
    error,

    // 事件处理函数
    handleTitleChange,
    handleBlocksChange,
    handleCoverImageChange,
    handleTagsChange,
    toggleSidebar,
    publishArticle,

    // 辅助函数
    hasContentChanged,
  };
}
