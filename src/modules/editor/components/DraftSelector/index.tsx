"use client";

import { useEffect } from "react";
import styles from "./styles.module.css";
import { DraftSelectorProps } from "./store/types";
import { useUserInfo } from "@/modules/auth/hooks/useUserInfo";
import { UserData } from "@/modules/auth/types/user";
import { DraftItem } from "./components/DraftItem";
import { EmptyState } from "./components/EmptyState";
import { useDraftSelector } from "./hooks/useDraftSelector";

export function DraftSelector({ onSelect }: DraftSelectorProps) {
  const { userInfo } = useUserInfo();
  const firebaseUser = userInfo.firebaseUser as UserData | null;
  const {
    state,
    loadDrafts,
    handleConfirmDelete,
    handleCancelDelete,
    handleClearError,
    dispatch,
  } = useDraftSelector(firebaseUser);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  if (state.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载草稿中...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{state.error.message}</p>
          {state.error.retryable && (
            <button className={styles.retryButton} onClick={loadDrafts}>
              重试
            </button>
          )}
          <button className={styles.closeButton} onClick={handleClearError}>
            关闭
          </button>
        </div>
      </div>
    );
  }

  if (state.drafts.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          message="没有找到未发布的草稿"
          suggestion="请选择其他创建方式，或先创建一个新文章"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>选择要继续编辑的草稿</h2>
      <div className={styles.draftList}>
        {state.drafts.map((draft) => (
          <DraftItem
            key={draft.id}
            draft={draft}
            isDeleting={state.deleteState.isDeleting}
            isConfirming={state.deleteState.confirmingId === draft.id}
            onSelect={onSelect}
            onDelete={() =>
              dispatch({ type: "START_DELETE", payload: draft.id })
            }
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
          />
        ))}
      </div>
    </div>
  );
}
