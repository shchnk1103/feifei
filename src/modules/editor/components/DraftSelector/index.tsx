"use client";

import { useState, useEffect } from "react";
import { Article } from "@/modules/blog/types/blog";
import { ArticleStorage } from "@/modules/blog/storage/articleStorage";
import { DefaultArticleCreator } from "@/modules/blog/services/articleCreator";
import styles from "./styles.module.css";
import { FiTrash2 } from "react-icons/fi";

interface DraftSelectorProps {
  onSelect: (articleId: string) => void;
}

export function DraftSelector({ onSelect }: DraftSelectorProps) {
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDrafts = () => {
    const storage = new ArticleStorage();
    const draftArticles = storage.getAllDrafts();
    setDrafts(draftArticles);
    setIsLoading(false);
  };

  useEffect(() => {
    // 在客户端加载草稿列表
    loadDrafts();
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击事件
    setDeleteConfirm(articleId);
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent,
    articleId: string
  ) => {
    e.stopPropagation(); // 阻止事件冒泡

    try {
      setIsDeleting(true);
      const articleCreator = new DefaultArticleCreator();
      await articleCreator.deleteDraft(articleId);

      // 验证草稿是否真的被删除
      const storage = new ArticleStorage();
      const stillExists = storage.getFromLocal(articleId);

      if (stillExists) {
        console.warn("草稿删除操作返回成功，但草稿仍存在于本地存储中");
        // 尝试再次删除
        storage.removeFromLocal(articleId);
      }

      // 重新加载草稿列表
      loadDrafts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("删除草稿失败:", error);

      // 检查错误类型，如果是网络问题但本地已删除，给予更明确的提示
      const errorMessage =
        error instanceof Error ? error.message : "删除草稿失败，请重试";

      if (errorMessage.includes("DELETE_ERROR")) {
        alert("本地草稿已删除，但服务器同步失败。请刷新页面查看最新状态。");
      } else if (errorMessage.includes("PERMISSION_ERROR")) {
        alert("没有权限删除该文章。只有文章作者或管理员可以删除文章。");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载草稿中...</div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>没有找到未发布的草稿</p>
          <p className={styles.suggestion}>
            请选择其他创建方式，或先创建一个新文章
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>选择要继续编辑的草稿</h2>
      <div className={styles.draftList}>
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className={styles.draftItem}
            onClick={() => onSelect(draft.id)}
          >
            <div className={styles.draftContent}>
              <h3 className={styles.draftTitle}>
                {draft.title || "未命名草稿"}
              </h3>
              <p className={styles.draftMeta}>
                {draft.updatedAt
                  ? `上次编辑: ${new Date(draft.updatedAt).toLocaleString()}`
                  : "最近编辑"}
              </p>
              <p className={styles.draftDescription}>
                {draft.description || "暂无描述"}
              </p>
            </div>
            <div className={styles.draftActions}>
              {deleteConfirm === draft.id ? (
                <div className={styles.deleteConfirm}>
                  <span>确认删除？</span>
                  <button
                    className={styles.confirmButton}
                    onClick={(e) => handleConfirmDelete(e, draft.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "删除中..." : "确认"}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteClick(e, draft.id)}
                  aria-label="删除草稿"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
