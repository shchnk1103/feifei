"use client";

import { Article } from "@/modules/blog/types/blog";
import { useArticleEditor } from "../../hooks/useArticleEditor";
import { EditorHeader } from "../EditorHeader";
import { EditorSidebar } from "../EditorSidebar";
import { EditorContent } from "../EditorContent";
import styles from "./styles.module.css";

interface ArticleEditorProps {
  initialArticle: Article;
}

/**
 * 文章编辑器组件
 * 提供文章编辑、自动保存和发布功能
 */
export function ArticleEditor({ initialArticle }: ArticleEditorProps) {
  // 使用自定义hook管理所有状态和逻辑
  const {
    // 状态
    article,
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
  } = useArticleEditor(initialArticle);

  // 加载状态
  if (loading) return <div className={styles.loading}>加载编辑器中...</div>;

  // 错误状态
  if (error) return <div className={styles.error}>加载文章失败: {error}</div>;

  return (
    <div className={styles.editorContainer}>
      {/* 编辑器顶部栏 */}
      <EditorHeader
        title={title}
        saveStatus={saveStatus}
        onTitleChange={handleTitleChange}
        onOpenSettings={() => toggleSidebar(true)}
        onPublish={publishArticle}
      />

      {/* 编辑器内容区 */}
      <div className={styles.editorContent}>
        <main className={styles.mainEditor}>
          <div className={styles.mainEditorContent}>
            <EditorContent
              blocks={blocks}
              coverImage={coverImage}
              onBlocksChange={handleBlocksChange}
              onCoverImageChange={handleCoverImageChange}
            />
          </div>
        </main>

        {/* 侧边栏 */}
        {sidebarOpen && (
          <EditorSidebar
            isOpen={sidebarOpen}
            onClose={() => toggleSidebar(false)}
            tags={tags}
            onTagsChange={handleTagsChange}
            article={article}
          />
        )}
      </div>
    </div>
  );
}
