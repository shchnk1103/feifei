"use client";

import Link from "next/link";
import styles from "./styles.module.css";

type SaveStatus = "saved" | "saving" | "error";

interface EditorHeaderProps {
  title: string;
  saveStatus: SaveStatus;
  onTitleChange: (title: string) => void;
  onOpenSettings: () => void;
  onPublish: () => void;
}

/**
 * 编辑器顶部组件
 *
 * 显示标题输入框、保存状态和操作按钮
 */
export function EditorHeader({
  title,
  saveStatus,
  onTitleChange,
  onOpenSettings,
  onPublish,
}: EditorHeaderProps) {
  // 保存状态显示文本
  const saveStatusText = {
    saved: "已保存",
    saving: "保存中...",
    error: "保存失败!",
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.backButton}>
          返回首页
        </Link>
        <input
          className={styles.titleInput}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="输入文章标题..."
        />
      </div>
      <div className={styles.rightSection}>
        <div className={`${styles.saveStatus} ${styles[saveStatus]}`}>
          {saveStatusText[saveStatus]}
        </div>
        <button className={styles.settingsButton} onClick={onOpenSettings}>
          设置
        </button>
        <button className={styles.publishButton} onClick={onPublish}>
          发布
        </button>
      </div>
    </header>
  );
}
