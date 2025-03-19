import { useState, useRef, useCallback, useEffect } from "react";
import { Article } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import { SaveStatus } from "../../types/articleEditor";
import { CONFIG, log } from "./constants";
import { createArticleToSave } from "./utils";

type LocalSaveHandlerProps = {
  article: Article | null;
  initialArticleId: string;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];
  hasContentChanged: () => boolean;
  isSaving: React.MutableRefObject<boolean>;
  isEditing: React.MutableRefObject<boolean>;
  lastLocalSave: React.MutableRefObject<number>;
  hasPendingDbChanges: React.MutableRefObject<boolean>;
  shouldSaveToDbOnEditingStop: React.MutableRefObject<boolean>;
  saveCount: React.MutableRefObject<{ local: number; db: number }>;
  scheduleDbSave: () => void;
  updateDebugInfo: (hasChanged?: boolean) => void;
};

type LocalSaveHandlerReturn = {
  saveStatus: SaveStatus;
  handleLocalAutoSave: () => void;
};

/**
 * 处理文章本地保存的逻辑
 */
export function useLocalSaveHandler({
  article,
  initialArticleId,
  title,
  blocks,
  coverImage,
  tags,
  hasContentChanged,
  isSaving,
  isEditing,
  lastLocalSave,
  hasPendingDbChanges,
  shouldSaveToDbOnEditingStop,
  saveCount,
  scheduleDbSave,
  updateDebugInfo,
}: LocalSaveHandlerProps): LocalSaveHandlerReturn {
  // UI状态
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // 本地保存定时器引用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 处理本地自动保存的函数
   */
  const handleLocalAutoSave = useCallback(() => {
    if (!article || !initialArticleId) return;

    // 如果正在保存中，跳过本次保存
    if (isSaving.current) {
      log("正在进行保存操作，跳过本次本地保存");
      return;
    }

    // 标记用户正在编辑
    isEditing.current = true;

    // 创建更新对象
    const updatedArticle = createArticleToSave(
      initialArticleId,
      title,
      coverImage,
      blocks,
      tags,
      article
    );

    // 保存到本地存储
    localStorage.setItem(
      `article-${initialArticleId}`,
      JSON.stringify(updatedArticle)
    );

    // 标记有待保存到数据库的更改
    hasPendingDbChanges.current = true;
    shouldSaveToDbOnEditingStop.current = true;

    // 更新本地保存时间和计数
    lastLocalSave.current = Date.now();
    saveCount.current.local += 1;

    log(
      `文章已保存到本地: ${new Date().toLocaleString()}, 本地保存次数: ${
        saveCount.current.local
      }`
    );

    // 本地保存后延迟计划一个数据库保存，使用更长的防抖延迟
    scheduleDbSave();

    // 更新UI状态
    setSaveStatus("saved");

    // 更新调试信息
    setTimeout(() => {
      updateDebugInfo(true);
    }, 0);
  }, [
    article,
    initialArticleId,
    title,
    blocks,
    coverImage,
    tags,
    isSaving,
    isEditing,
    hasPendingDbChanges,
    shouldSaveToDbOnEditingStop,
    lastLocalSave,
    saveCount,
    scheduleDbSave,
    updateDebugInfo,
  ]);

  /**
   * 自动保存到本地功能 - 使用更强的防抖逻辑
   */
  useEffect(() => {
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // 没有变化或缺少必要参数不需要保存
    if (!initialArticleId || !article) {
      return;
    }

    // 检查内容是否有实际变化
    const hasChanges = hasContentChanged();
    if (!hasChanges) {
      log(`内容未改变，跳过自动保存`);
      return;
    }

    // 如果距离上次本地保存时间太短，使用更长的防抖延迟
    const timeSinceLastLocalSave = Date.now() - lastLocalSave.current;
    const useExtendedDelay = timeSinceLastLocalSave < CONFIG.DEBOUNCE_WAIT;
    const currentDelay = useExtendedDelay
      ? CONFIG.DEBOUNCE_WAIT
      : CONFIG.LOCAL_SAVE_DELAY;

    log(
      `内容已更改，准备自动保存，使用${
        useExtendedDelay ? "扩展" : "标准"
      }延迟: ${currentDelay}ms`
    );

    // 设置状态为保存中
    setSaveStatus("saving");

    // 使用防抖保存
    const newTimeoutId = setTimeout(() => {
      log(`防抖延迟结束，执行自动保存到本地`);

      // 只在这里调用本地保存，不再间接触发数据库保存
      if (article && initialArticleId && !isSaving.current) {
        handleLocalAutoSave();
      }
    }, currentDelay);

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
    initialArticleId,
    title,
    blocks,
    coverImage,
    tags,
    hasContentChanged,
    article,
    handleLocalAutoSave,
    isSaving,
    lastLocalSave,
  ]);

  return {
    saveStatus,
    handleLocalAutoSave,
  };
}
