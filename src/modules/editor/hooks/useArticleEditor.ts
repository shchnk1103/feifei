"use client";

import { useArticle } from "@/modules/blog/hooks/useArticle";
import { Article } from "@/modules/blog/types/blog";
import { ArticleEditorReturn, UpdateableArticle } from "./types/articleEditor";
import { useArticleState } from "./utils/useArticleState";
import { useArticleSave } from "./useArticleSave";
import { useArticleLoad } from "./utils/useArticleLoad";
import { useArticlePublish } from "./utils/useArticlePublish";
import { useState, useCallback, useEffect, useMemo } from "react";

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

  // 管理文章基本状态
  const {
    title,
    blocks,
    coverImage,
    tags,
    sidebarOpen,
    initialLoadedData, // eslint-disable-line @typescript-eslint/no-unused-vars
    setTitle,
    setBlocks,
    setCoverImage,
    setTags,
    setInitialLoadedData,
    handleTitleChange,
    handleBlocksChange,
    handleCoverImageChange,
    handleTagsChange,
    toggleSidebar,
    hasContentChanged,
  } = useArticleState(initialArticle);

  // 管理调试信息的更新函数
  const [updateDebugInfoFn, setUpdateDebugInfoFn] = useState<
    (changed?: boolean) => void
  >(() => () => {});

  // 创建一个包装函数，用于在设置updateDebugInfoFn之前调用
  const updateDebugInfo = useCallback(
    (changed?: boolean) => {
      updateDebugInfoFn(changed);
    },
    [updateDebugInfoFn]
  );

  // 管理文章保存
  const {
    saveStatus,
    saveCount,
    handleLocalAutoSave,
    saveArticleToDb,
    setInitialData,
  } = useArticleSave({
    article: article || null,
    initialArticleId: initialArticle.id,
    title,
    blocks,
    coverImage,
    tags,
    updateArticle,
    setInitialLoadedData,
    updateDebugInfo,
  });

  // 创建一个调试信息对象，以保持与旧API兼容
  const debugInfo = useMemo(
    () => ({
      lastLocalSaveTime: "最后保存时间显示在状态栏",
      lastDbSaveTime: "最后数据库保存时间由后端记录",
      hasPendingDbChanges: false,
      contentChanged: hasContentChanged(),
      saveCount: saveCount,
    }),
    [saveCount, hasContentChanged]
  );

  // 将自动保存功能与内容变更绑定
  useEffect(() => {
    if (hasContentChanged()) {
      handleLocalAutoSave();
    }
  }, [title, blocks, coverImage, tags, hasContentChanged, handleLocalAutoSave]);

  // 提供updateDebugInfo函数给useArticleSave - 移到useEffect中避免无限循环
  useEffect(() => {
    // 只在组件首次挂载时设置一次，避免多次触发
    let hasSet = false;

    setUpdateDebugInfoFn(() => () => {
      if (!hasSet) {
        hasSet = true;
        console.log("[调试] useArticleEditor首次设置updateDebugInfoFn");
      }
      // 这个函数会被useArticleSave中的函数覆盖
    });
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // 管理文章发布
  const { publishArticle } = useArticlePublish({
    article: article || null,
    title,
    blocks,
    coverImage,
    tags,
    saveArticleToDb,
    setInitialLoadedData: setInitialData,
    setSaveStatus: () => {
      // 这个会被useArticleSave的setSaveStatus覆盖
    },
    updateDebugInfo,
  });

  // 加载文章数据
  useArticleLoad({
    article: article || null,
    loading,
    setTitle,
    setBlocks,
    setCoverImage,
    setTags,
    setInitialLoadedData: setInitialData,
    updateDebugInfo,
  });

  return {
    // 文章数据
    article: article || initialArticle,
    title,
    blocks,
    coverImage,
    tags,

    // UI状态
    loading,
    error,
    saveStatus,
    sidebarOpen,
    debugInfo,

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
