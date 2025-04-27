"use client";

import { Article, DEFAULT_ARTICLE } from "@/modules/blog/types/blog";
import { ArticleEditor } from "./ArticleEditor";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { normalizeArticle } from "../utils/normalizeArticle";
import { mergeArticle } from "../utils/mergeArticle";
export interface EditorClientPageProps {
  id: string;
}

export function EditorClientPage({ id }: EditorClientPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        let loadedArticle: Article | null = null;

        if (id.startsWith("draft-")) {
          // 新建草稿
          loadedArticle = {
            ...DEFAULT_ARTICLE,
            id,
            title: "未命名文章",
            articleContent: {
              ...DEFAULT_ARTICLE.articleContent,
              blocks: [
                {
                  id: `block-${Date.now()}`,
                  type: "heading",
                  content: "开始写作吧",
                  level: 1,
                },
                {
                  id: `block-${Date.now() + 1}`,
                  type: "text",
                  content: "这是您新文章的开始。点击任何地方开始编辑...",
                },
              ],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "draft",
          };
        } else {
          // 通过 API 获取已有文章
          try {
            const res = await fetch(`/api/articles/${id}`);
            if (!res.ok) {
              throw new Error("文章不存在");
            }
            loadedArticle = normalizeArticle(await res.json());
          } catch {
            loadedArticle = null;
          }
        }

        // 本地存储优先（仅在 loadedArticle 存在时合并）
        if (loadedArticle) {
          const storedArticle = localStorage.getItem(`article-${id}`);
          if (storedArticle) {
            const parsedArticle = normalizeArticle(JSON.parse(storedArticle));
            if (parsedArticle.id === id) {
              loadedArticle = mergeArticle(loadedArticle, parsedArticle);
            }
          }
        }

        if (!loadedArticle) {
          setError("未找到该文章");
        }
        setArticle(loadedArticle);
      } catch (err) {
        console.log("加载文章失败", err);
        setError("加载文章失败");
        setArticle(null);
      }
    }

    fetchArticle();
  }, [id]);

  // 优先显示错误信息
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // 显示加载状态
  if (!article) {
    return <div className={styles.loading}>加载编辑器中...</div>;
  }

  return <ArticleEditor initialArticle={article} />;
}
