"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Block } from "@/types/blocks";
import { Article, ArticleStatus, ArticleVisibility } from "@/types/blog";
import { useArticle } from "@/hooks/useArticle";
import { BlockEditor } from "../BlockEditor";
import { EditorSidebar } from "../EditorSidebar";
import styles from "./styles.module.css";

// 用于更新文章的类型，包含部分可选字段
type UpdateableArticle = Partial<Omit<Article, "id">> & {
  id: string;
  // 处理 Date 与 string 的兼容性
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  createdAt?: Date | string;
};

interface ArticleEditorProps {
  initialArticle: Article;
}

export function ArticleEditor({ initialArticle }: ArticleEditorProps) {
  const { article, loading, error, updateArticle } = useArticle<
    Article,
    UpdateableArticle
  >(initialArticle.id);

  const [title, setTitle] = useState<string>(
    initialArticle.title || "未命名文章"
  );
  const [blocks, setBlocks] = useState<Block[]>(
    initialArticle.articleContent?.blocks || []
  );
  const [coverImage, setCoverImage] = useState<string>(
    initialArticle.imageSrc || ""
  );
  const [tags, setTags] = useState<string[]>(initialArticle.tags || []);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 加载文章数据
  useEffect(() => {
    if (article && !loading) {
      setTitle(article.title || "未命名文章");
      setBlocks(article.articleContent?.blocks || []);
      setCoverImage(article.imageSrc || "");
      setTags(article.tags || []);
    }
  }, [article, loading]);

  // 自动保存功能
  useEffect(() => {
    // 防止不必要的保存，只有当标题或块内容变化时才保存
    if (!initialArticle?.id || !title || !blocks || blocks.length === 0) {
      return;
    }

    setSaveStatus("saving");

    // 使用防抖，避免过于频繁的保存操作
    const saveTimeout = setTimeout(() => {
      try {
        const articleId = initialArticle.id;

        // 合并当前数据创建完整的文章对象，保留原始文章的所有字段
        const updatedArticle: UpdateableArticle = {
          ...(article as Article), // 首先复制原始文章的所有字段
          ...initialArticle, // 然后复制初始文章的所有字段
          id: initialArticle.id, // 确保 ID 存在
          title, // 更新修改的字段
          imageSrc: coverImage,
          articleContent: {
            blocks,
            version: article?.articleContent?.version || 1,
          },
          tags,
          updatedAt: new Date(),
        };

        // 保存到本地存储
        localStorage.setItem(
          `article-${articleId}`,
          JSON.stringify(updatedArticle)
        );

        setSaveStatus("saved");

        // 如果 updateArticle 函数存在，也调用它
        if (article && updateArticle) {
          updateArticle(updatedArticle).catch((err: Error) => {
            console.error("更新文章失败:", err);
            setSaveStatus("error");
          });
        }
      } catch (error) {
        console.error("保存文章失败:", error);
        setSaveStatus("error");
      }
    }, 1000); // 1秒防抖

    // 清理函数
    return () => clearTimeout(saveTimeout);
  }, [initialArticle, title, blocks, coverImage, tags, article, updateArticle]);

  // 处理标题变更
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    handleContentChange();
  };

  // 处理内容变更
  const handleContentChange = () => {
    setSaveStatus("saving");

    // 在实际应用中，这里应该使用防抖来减少保存频率
    const timer = setTimeout(() => {
      if (article) {
        const updatedArticle: UpdateableArticle = {
          id: article.id,
          title: title,
          imageSrc: coverImage,
          articleContent: {
            ...article.articleContent,
            blocks: blocks,
          },
          tags: tags,
          updatedAt: new Date(),
        };

        updateArticle(updatedArticle)
          .then(() => setSaveStatus("saved"))
          .catch((err: Error) => {
            console.error("更新文章失败:", err);
            setSaveStatus("error");
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  };

  // 处理块内容变更
  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    handleContentChange();
  };

  // 处理发布文章
  const handlePublish = async () => {
    if (!article) return;

    try {
      setSaveStatus("saving");

      const publishArticle: UpdateableArticle = {
        id: article.id,
        title,
        description:
          blocks.find((b) => b.type === "text")?.content.slice(0, 150) || "",
        imageSrc: coverImage,
        articleContent: {
          ...article.articleContent,
          blocks,
        },
        tags,
        status: "published" as ArticleStatus,
        publishedAt: new Date(),
        visibility: "public" as ArticleVisibility,
      };

      await updateArticle(publishArticle);

      setSaveStatus("saved");
      alert("文章发布成功！");
    } catch (e) {
      console.error("Error publishing article:", e);
      setSaveStatus("error");
      alert("发布失败，请稍后重试");
    }
  };

  if (loading) return <div className={styles.loading}>加载编辑器中...</div>;
  if (error) return <div className={styles.error}>加载文章失败: {error}</div>;

  // 准备传递给侧边栏的安全类型的文章对象
  const sidebarArticle: Article = article || initialArticle;

  return (
    <div className={styles.editorContainer}>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.backButton}>
            返回首页
          </Link>
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="输入文章标题..."
          />
        </div>
        <div className={styles.rightSection}>
          <div className={`${styles.saveStatus} ${styles[saveStatus]}`}>
            {saveStatus === "saved" && "已保存"}
            {saveStatus === "saving" && "保存中..."}
            {saveStatus === "error" && "保存失败!"}
          </div>
          <button
            className={styles.settingsButton}
            onClick={() => setSidebarOpen(true)}
          >
            设置
          </button>
          <button className={styles.publishButton} onClick={handlePublish}>
            发布
          </button>
        </div>
      </header>

      <div className={styles.editorContent}>
        <main className={styles.mainEditor}>
          <BlockEditor
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
            coverImage={coverImage}
            onCoverImageChange={setCoverImage}
          />
        </main>

        {sidebarOpen && (
          <EditorSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            tags={tags}
            onTagsChange={setTags}
            article={sidebarArticle}
          />
        )}
      </div>
    </div>
  );
}
