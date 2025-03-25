"use client";

import { Article } from "@/modules/blog/types/blog";
import { ArticleEditor } from "./ArticleEditor";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface EditorClientPageProps {
  initialArticle: Article;
}

export function EditorClientPage({ initialArticle }: EditorClientPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 加载本地存储中的文章数据，如果有的话
  useEffect(() => {
    try {
      const storedArticle = localStorage.getItem(
        `article-${initialArticle.id}`
      );

      if (storedArticle) {
        // 解析本地存储数据
        const parsedArticle = JSON.parse(storedArticle);

        // 如果本地存储的文章ID与初始文章ID相同，则使用本地版本
        if (parsedArticle.id === initialArticle.id) {
          // 合并本地数据和初始数据，保留最新的编辑状态
          setArticle({
            ...initialArticle,
            ...parsedArticle,
            // 合并元数据，因为服务器可能有最新的统计信息
            metadata: {
              ...initialArticle.metadata,
              ...parsedArticle.metadata,
            },
          });
          return;
        }
      }

      // 如果没有本地存储或ID不匹配，使用初始文章
      setArticle(initialArticle);
    } catch (err) {
      console.error("加载本地存储文章失败:", err);
      setError("加载本地保存的文章数据失败，使用服务器数据");
      setArticle(initialArticle);
    }
  }, [initialArticle]);

  // 显示加载状态
  if (!article) {
    return <div className={styles.loading}>加载编辑器中...</div>;
  }

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <ArticleEditor initialArticle={article} />
    </>
  );
}
