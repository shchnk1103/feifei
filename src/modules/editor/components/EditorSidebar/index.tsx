"use client";

import { motion } from "framer-motion";
import { BiX } from "react-icons/bi";
import { Article } from "@/modules/blog/types/blog";
import styles from "./styles.module.css";

interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  article: Article;
}

export function EditorSidebar({
  isOpen,
  onClose,
  tags = [],
  onTagsChange,
  article,
}: EditorSidebarProps) {
  // 侧边栏动画
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // 背景遮罩动画
  const backdropVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } },
  };

  // 添加标签
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
        e.currentTarget.value = "";
      }
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial="closed"
        animate="open"
        exit="closed"
        variants={backdropVariants}
        onClick={onClose}
      />

      <motion.div
        className={styles.sidebar}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className={styles.sidebarHeader}>
          <h3>文章设置</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <BiX size={24} />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>文章信息</h4>

            <div className={styles.settingItem}>
              <label className={styles.label}>文章ID</label>
              <div className={styles.value}>{article?.id || "未保存"}</div>
            </div>

            <div className={styles.settingItem}>
              <label className={styles.label}>创建时间</label>
              <div className={styles.value}>
                {article?.createdAt
                  ? new Date(article.createdAt).toLocaleString()
                  : "未保存"}
              </div>
            </div>

            <div className={styles.settingItem}>
              <label className={styles.label}>状态</label>
              <div className={styles.statusBadge}>
                {article?.status === "published" ? "已发布" : "草稿"}
              </div>
            </div>
          </div>

          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>标签</h4>
            <div className={styles.tagList}>
              {tags.map((tag) => (
                <div key={tag} className={styles.tag}>
                  {tag}
                  <button
                    className={styles.removeTagButton}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.tagInput}>
              <input
                type="text"
                placeholder="输入标签并按Enter"
                onKeyDown={handleAddTag}
                className={styles.input}
              />
            </div>
            <p className={styles.hint}>
              添加标签可以帮助读者更好地发现你的文章
            </p>
          </div>

          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>SEO 优化</h4>

            <div className={styles.settingItem}>
              <label className={styles.label}>SEO 标题</label>
              <input
                type="text"
                className={styles.input}
                placeholder="搜索引擎显示的标题"
              />
            </div>

            <div className={styles.settingItem}>
              <label className={styles.label}>SEO 描述</label>
              <textarea
                className={styles.textarea}
                placeholder="搜索引擎显示的描述文字"
                rows={3}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
