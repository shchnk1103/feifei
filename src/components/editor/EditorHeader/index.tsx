"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BiSave, BiCog, BiArrowBack, BiSend } from "react-icons/bi";
// 使用 BiSend 替代 BiPublish，因为 BiPublish 不存在
import Link from "next/link";
import styles from "./styles.module.css";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: "saved" | "saving" | "error";
  onPublish: () => void;
  onToggleSidebar: () => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  saveStatus,
  onPublish,
  onToggleSidebar,
}: EditorHeaderProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saved":
        return "已保存";
      case "saving":
        return "正在保存...";
      case "error":
        return "保存失败!";
      default:
        return "";
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.backButton}>
          <BiArrowBack />
          <span className={styles.backText}>返回首页</span>
        </Link>

        <div
          className={`${styles.titleWrapper} ${
            isFocused ? styles.focused : ""
          }`}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="输入文章标题..."
            className={styles.titleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={`${styles.saveStatus} ${styles[saveStatus]}`}>
          {saveStatus === "saved" && <BiSave className={styles.saveIcon} />}
          <span>{getSaveStatusText()}</span>
        </div>

        <motion.button
          className={styles.settingsButton}
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BiCog />
          <span>设置</span>
        </motion.button>

        <motion.button
          className={styles.publishButton}
          onClick={onPublish}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BiSend />
          <span>发布</span>
        </motion.button>
      </div>
    </header>
  );
}
