import { useRef, useEffect, useState, useCallback } from "react";
import { Article } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import {
  ArticleContent,
  SaveStatus,
  UpdateableArticle,
} from "./types/articleEditor";
import { useLocalSaveHandler } from "./utils/articleSave/localSaveHandler";
import { useDbSaveHandler } from "./utils/articleSave/dbSaveHandler";

type UseArticleSaveProps = {
  article: Article | null;
  initialArticleId: string;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];
  updateArticle: (article: UpdateableArticle) => Promise<UpdateableArticle>;
  setInitialLoadedData: (data: ArticleContent) => void;
  updateDebugInfo: (hasChanged?: boolean) => void;
};

type UseArticleSaveReturn = {
  saveStatus: SaveStatus;
  saveCount: { local: number; db: number };
  handleLocalAutoSave: () => void;
  saveArticleToDb: (updatedArticle?: UpdateableArticle) => Promise<void>;
  checkAndSaveToDb: () => void;
  cleanupTimers: () => void;
  setInitialData: (data: ArticleContent) => void;
};

/**
 * 文章保存 Hook
 * 处理文章的本地保存和数据库保存逻辑
 */
export function useArticleSave({
  article,
  initialArticleId,
  title,
  blocks,
  coverImage,
  tags,
  updateArticle,
  setInitialLoadedData,
  updateDebugInfo,
}: UseArticleSaveProps): UseArticleSaveReturn {
  // 状态管理
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveCount = useRef<{ local: number; db: number }>({ local: 0, db: 0 });

  // 编辑状态管理
  const isEditing = useRef<boolean>(false);
  const isSaving = useRef<boolean>(false);
  const lastLocalSave = useRef<number>(0);
  const lastDbSave = useRef<number>(0);
  const hasPendingDbChanges = useRef<boolean>(false);
  const shouldSaveToDbOnEditingStop = useRef<boolean>(false);

  // 内容引用
  const titleRef = useRef<string>(title);
  const blocksRef = useRef<Block[]>(blocks);
  const coverImageRef = useRef<string>(coverImage);
  const tagsRef = useRef<string[]>(tags);
  const initialLoadedDataRef = useRef<ArticleContent | null>(null);

  // 更新内容引用
  useEffect(() => {
    titleRef.current = title;
    blocksRef.current = blocks;
    coverImageRef.current = coverImage;
    tagsRef.current = tags;
  }, [title, blocks, coverImage, tags]);

  // 添加特定的 hook 来监听和更新初始加载数据
  const setAndUpdateInitialLoadedData = useCallback(
    (data: ArticleContent) => {
      initialLoadedDataRef.current = data;
      setInitialLoadedData(data);
    },
    [setInitialLoadedData]
  );

  // 使用本地保存处理器
  const { handleLocalAutoSave } = useLocalSaveHandler({
    article,
    initialArticleId,
    title,
    blocks,
    coverImage,
    tags,
    hasContentChanged: () => {
      if (!initialLoadedDataRef.current) return false;
      return (
        titleRef.current !== initialLoadedDataRef.current.title ||
        JSON.stringify(blocksRef.current) !==
          JSON.stringify(initialLoadedDataRef.current.blocks) ||
        coverImageRef.current !== initialLoadedDataRef.current.imageSrc ||
        JSON.stringify(tagsRef.current) !==
          JSON.stringify(initialLoadedDataRef.current.tags)
      );
    },
    isSaving,
    isEditing,
    lastLocalSave,
    hasPendingDbChanges,
    shouldSaveToDbOnEditingStop,
    saveCount,
    scheduleDbSave: () => {
      // 这个函数会被 useDbSaveHandler 提供
      if (scheduleDbSaveRef.current) {
        scheduleDbSaveRef.current();
      }
    },
    updateDebugInfo,
  });

  // 使用数据库保存处理器
  const { saveArticleToDb, scheduleDbSave, checkAndSaveToDb, cleanupTimers } =
    useDbSaveHandler({
      article,
      initialArticleId,
      title,
      blocks,
      coverImage,
      tags,
      updateArticle,
      setInitialLoadedData: setAndUpdateInitialLoadedData,
      updateDebugInfo,
      setSaveStatus,
      isSaving,
      isEditing,
      lastDbSave,
      hasPendingDbChanges,
      shouldSaveToDbOnEditingStop,
      saveCount,
      titleRef,
      blocksRef,
      coverImageRef,
      tagsRef,
      initialLoadedDataRef,
    });

  // 保存 scheduleDbSave 的引用，以便本地保存处理器可以调用
  const scheduleDbSaveRef = useRef<() => void>(scheduleDbSave);
  useEffect(() => {
    scheduleDbSaveRef.current = scheduleDbSave;
  }, [scheduleDbSave]);

  // 定期检查是否需要保存到数据库
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkAndSaveToDb();
    }, 10000); // 每10秒检查一次

    return () => {
      clearInterval(intervalId);
      cleanupTimers();
    };
  }, [checkAndSaveToDb, cleanupTimers]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, [cleanupTimers]);

  return {
    saveStatus,
    saveCount: saveCount.current,
    handleLocalAutoSave,
    saveArticleToDb,
    checkAndSaveToDb,
    cleanupTimers,
    setInitialData: setAndUpdateInitialLoadedData,
  };
}
