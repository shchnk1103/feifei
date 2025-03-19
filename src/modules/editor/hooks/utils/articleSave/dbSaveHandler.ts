import { useCallback, useRef } from "react";
import { Article } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import { ArticleContent, UpdateableArticle } from "../../types/articleEditor";
import { CONFIG, log, logError } from "./constants";
import { createArticleToSave, hasContentChanged } from "./utils";

type DbSaveHandlerProps = {
  article: Article | null;
  initialArticleId: string;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];
  updateArticle: (article: UpdateableArticle) => Promise<UpdateableArticle>;
  setInitialLoadedData: (data: ArticleContent) => void;
  updateDebugInfo: (hasChanged?: boolean) => void;
  setSaveStatus: (status: "saved" | "saving" | "error") => void;
  isSaving: React.MutableRefObject<boolean>;
  isEditing: React.MutableRefObject<boolean>;
  lastDbSave: React.MutableRefObject<number>;
  hasPendingDbChanges: React.MutableRefObject<boolean>;
  shouldSaveToDbOnEditingStop: React.MutableRefObject<boolean>;
  saveCount: React.MutableRefObject<{ local: number; db: number }>;
  titleRef: React.MutableRefObject<string>;
  blocksRef: React.MutableRefObject<Block[]>;
  coverImageRef: React.MutableRefObject<string>;
  tagsRef: React.MutableRefObject<string[]>;
  initialLoadedDataRef: React.MutableRefObject<ArticleContent | null>;
};

type DbSaveHandlerReturn = {
  saveArticleToDb: (updatedArticle?: UpdateableArticle) => Promise<void>;
  scheduleDbSave: () => void;
  checkAndSaveToDb: () => void;
  cleanupTimers: () => void;
};

/**
 * 处理文章数据库保存的逻辑
 */
export function useDbSaveHandler({
  article,
  initialArticleId,
  title,
  blocks,
  coverImage,
  tags,
  updateArticle,
  setInitialLoadedData,
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
}: DbSaveHandlerProps): DbSaveHandlerReturn {
  // 数据库保存相关定时器引用
  const dbSaveDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 新增：统计被防抖合并的编辑次数
  const debouncedEditCountRef = useRef<number>(0);

  /**
   * 清理所有定时器的辅助函数
   */
  const cleanupTimers = useCallback(() => {
    if (editingTimeoutRef.current) {
      clearTimeout(editingTimeoutRef.current);
      editingTimeoutRef.current = null;
    }
    if (dbSaveDebounceTimerRef.current) {
      clearTimeout(dbSaveDebounceTimerRef.current);
      dbSaveDebounceTimerRef.current = null;
    }
  }, []);

  /**
   * 保存文章内容到数据库
   */
  const saveArticleToDb = useCallback(
    async (updatedArticle?: UpdateableArticle) => {
      if (!article || !initialArticleId) return;

      // 如果正在保存，避免重复保存
      if (isSaving.current) {
        log("正在进行保存操作，跳过重复保存请求");
        return;
      }

      // 设置正在保存状态
      isSaving.current = true;

      log(`开始保存文章到数据库: ${new Date().toLocaleString()}`);
      log(`距离上次数据库保存: ${Date.now() - lastDbSave.current}ms`);

      try {
        // 使用传入的更新对象或创建新的
        const articleToSave =
          updatedArticle ||
          createArticleToSave(
            initialArticleId,
            title,
            coverImage,
            blocks,
            tags,
            article
          );

        // 调用API保存
        await updateArticle(articleToSave);

        // 更新初始数据，以便后续比较
        setInitialLoadedData({
          title,
          blocks,
          imageSrc: coverImage,
          tags,
        });

        // 重置标记
        hasPendingDbChanges.current = false;
        shouldSaveToDbOnEditingStop.current = false;

        // 更新最后保存时间和计数
        lastDbSave.current = Date.now();
        saveCount.current.db += 1;

        log(
          `文章已保存到数据库: ${initialArticleId}, 数据库保存次数: ${saveCount.current.db}`
        );

        // 设置为已保存状态
        setSaveStatus("saved");

        // 异步更新调试信息
        setTimeout(() => {
          updateDebugInfo(false); // 刚保存过，内容没有变更
        }, 0);
      } catch (error) {
        logError("保存文章到数据库失败:", error);
        setSaveStatus("error");
        hasPendingDbChanges.current = true;

        setTimeout(() => {
          updateDebugInfo(true);
        }, 0);
      } finally {
        // 无论成功失败，都重置保存状态
        isSaving.current = false;
      }
    },
    [
      article,
      initialArticleId,
      title,
      blocks,
      coverImage,
      tags,
      updateArticle,
      setInitialLoadedData,
      updateDebugInfo,
      setSaveStatus,
      isSaving,
      hasPendingDbChanges,
      shouldSaveToDbOnEditingStop,
      lastDbSave,
      saveCount,
    ]
  );

  /**
   * 安排一个延迟的数据库保存，会取消之前的保存计划
   * 使用真正的防抖逻辑确保多次调用只触发一次保存
   */
  const scheduleDbSave = useCallback(() => {
    // 取消之前的数据库保存计划（如果有）
    if (dbSaveDebounceTimerRef.current) {
      clearTimeout(dbSaveDebounceTimerRef.current);
      dbSaveDebounceTimerRef.current = null;
    }

    // 增加防抖合并计数
    debouncedEditCountRef.current += 1;

    log(
      `安排延迟数据库保存，延迟: ${CONFIG.EDITING_IDLE_DELAY}ms, 已合并编辑次数: ${debouncedEditCountRef.current}`
    );

    // 设置新的定时器
    dbSaveDebounceTimerRef.current = setTimeout(() => {
      log(
        `延迟保存定时器触发，检查内容是否需要保存，合并了 ${debouncedEditCountRef.current} 次编辑`
      );

      // 重置合并计数
      debouncedEditCountRef.current = 0;

      // 执行到这里意味着用户已经停止编辑一段时间
      isEditing.current = false;

      // 检查是否应该保存到数据库
      if (shouldSaveToDbOnEditingStop.current && !isSaving.current) {
        const contentChanged = hasContentChanged(
          titleRef,
          blocksRef,
          coverImageRef,
          tagsRef,
          initialLoadedDataRef
        );

        if (contentChanged) {
          log("用户停止编辑且有内容变化，执行一次性数据库保存");
          log(
            `当前标题: "${titleRef.current}", 原始标题: "${
              initialLoadedDataRef.current?.title || ""
            }"`
          );
          log(
            `当前封面: "${coverImageRef.current}", 原始封面: "${
              initialLoadedDataRef.current?.imageSrc || ""
            }"`
          );
          log(
            `当前标签数: ${tagsRef.current.length}, 原始标签数: ${
              initialLoadedDataRef.current?.tags?.length || 0
            }`
          );

          // 先重置状态再保存，避免保存过程中又触发新的保存
          shouldSaveToDbOnEditingStop.current = false;
          hasPendingDbChanges.current = false;

          // 标记正在保存中
          isSaving.current = true;

          // 直接执行数据库保存
          if (article && initialArticleId) {
            const articleToSave = createArticleToSave(
              initialArticleId,
              titleRef.current,
              coverImageRef.current,
              blocksRef.current,
              tagsRef.current,
              article
            );

            log("开始直接保存到数据库 - 由延迟定时器触发");
            saveArticleToDb(articleToSave).finally(() => {
              // 保存完成后重置保存状态
              isSaving.current = false;
            });
          } else {
            isSaving.current = false;
          }
        } else {
          log("用户停止编辑但内容无变化，不执行数据库保存");
          hasPendingDbChanges.current = false;
          shouldSaveToDbOnEditingStop.current = false;
        }
      }

      dbSaveDebounceTimerRef.current = null;
    }, CONFIG.EDITING_IDLE_DELAY);
  }, [
    saveArticleToDb,
    article,
    initialArticleId,
    isSaving,
    isEditing,
    hasPendingDbChanges,
    shouldSaveToDbOnEditingStop,
    titleRef,
    blocksRef,
    coverImageRef,
    tagsRef,
    initialLoadedDataRef,
  ]);

  /**
   * 定期检查是否需要保存到数据库（备用机制）
   */
  const checkAndSaveToDb = useCallback(() => {
    const now = Date.now();
    const timeSinceLastDbSave = now - lastDbSave.current;

    // 添加更详细的调试信息
    log(`定期检查状态:
      - 距离上次保存: ${timeSinceLastDbSave}ms
      - 是否正在保存: ${isSaving.current}
      - 是否正在编辑: ${isEditing.current}
      - 是否有待保存变更: ${hasPendingDbChanges.current}
      - 是否标记了停止编辑后保存: ${shouldSaveToDbOnEditingStop.current}
      - 是否有延迟保存计划: ${dbSaveDebounceTimerRef.current !== null}
    `);

    // 跳过定期保存的条件
    // 1. 如果正在保存中
    if (isSaving.current) {
      log("正在进行保存操作，跳过定期保存");
      return;
    }

    // 2. 如果有正在进行的延迟保存计划
    if (dbSaveDebounceTimerRef.current !== null) {
      log("有延迟保存计划正在进行，跳过定期保存");
      return;
    }

    // 3. 如果用户正在编辑
    if (isEditing.current) {
      log("用户正在编辑，跳过定期保存");
      return;
    }

    // 4. 如果已经标记了"停止编辑后应该保存"
    if (shouldSaveToDbOnEditingStop.current) {
      log("已标记编辑停止后保存，跳过定期保存");
      return;
    }

    // 检查内容是否真的变化了
    const contentChanged = hasContentChanged(
      titleRef,
      blocksRef,
      coverImageRef,
      tagsRef,
      initialLoadedDataRef
    );

    // 添加调试信息
    log(`检查内容是否变化: ${contentChanged ? "有变化" : "无变化"}`);
    if (contentChanged) {
      log(
        `当前标题: "${titleRef.current}", 原始标题: "${
          initialLoadedDataRef.current?.title || ""
        }"`
      );
      log(
        `当前封面: "${coverImageRef.current}", 原始封面: "${
          initialLoadedDataRef.current?.imageSrc || ""
        }"`
      );
      log(
        `当前标签数: ${tagsRef.current.length}, 原始标签数: ${
          initialLoadedDataRef.current?.tags?.length || 0
        }`
      );

      // 如果检测到内容变化，但hasPendingDbChanges为false，则设置为true
      if (!hasPendingDbChanges.current) {
        log(
          "检测到内容变化但未标记待保存状态，设置 hasPendingDbChanges = true"
        );
        hasPendingDbChanges.current = true;
      }
    } else if (!contentChanged && hasPendingDbChanges.current) {
      log(
        `当前标题: "${titleRef.current}", 原始标题: "${
          initialLoadedDataRef.current?.title || ""
        }"`
      );
      log(
        `当前封面: "${coverImageRef.current}", 原始封面: "${
          initialLoadedDataRef.current?.imageSrc || ""
        }"`
      );
      log(
        `当前标签数: ${tagsRef.current.length}, 原始标签数: ${
          initialLoadedDataRef.current?.tags?.length || 0
        }`
      );
    }

    // 只有在特殊情况下才由定期检查触发保存 - 增加时间间隔要求
    if (
      contentChanged &&
      hasPendingDbChanges.current &&
      timeSinceLastDbSave >= CONFIG.DB_SAVE_DELAY * 3 && // 增加到3倍延迟
      !isEditing.current &&
      !shouldSaveToDbOnEditingStop.current &&
      dbSaveDebounceTimerRef.current === null &&
      !isSaving.current
    ) {
      log("备用机制：定期检查触发数据库保存 - 长时间未保存且有内容变化");
      // 重置状态，避免重复保存
      hasPendingDbChanges.current = false;
      shouldSaveToDbOnEditingStop.current = false;
      saveArticleToDb();
    } else {
      if (!contentChanged && hasPendingDbChanges.current) {
        log("内容未变化，重置待保存状态");
        hasPendingDbChanges.current = false;
        shouldSaveToDbOnEditingStop.current = false;
      }

      // 只有在不进行数据库保存时才更新调试信息
      setTimeout(() => {
        updateDebugInfo(contentChanged);
      }, 0);
    }
  }, [
    saveArticleToDb,
    updateDebugInfo,
    isSaving,
    isEditing,
    lastDbSave,
    hasPendingDbChanges,
    shouldSaveToDbOnEditingStop,
    titleRef,
    blocksRef,
    coverImageRef,
    tagsRef,
    initialLoadedDataRef,
  ]);

  return {
    saveArticleToDb,
    scheduleDbSave,
    checkAndSaveToDb,
    cleanupTimers,
  };
}
