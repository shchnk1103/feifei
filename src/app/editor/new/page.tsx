"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Article, DEFAULT_ARTICLE } from "@/modules/blog/types/blog";
import { articleService } from "@/modules/blog/services/articleService";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import styles from "./styles.module.css";

export default function NewArticlePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const createTempArticle = async () => {
      try {
        if (!isAuthenticated || !user) {
          throw new Error("请先登录");
        }

        if (!user.id) {
          throw new Error("无法获取用户ID，请重新登录");
        }

        // 生成临时ID
        const tempId = `draft-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;

        // 创建新文章，基于默认模板
        const tempArticle: Article = {
          ...DEFAULT_ARTICLE,
          id: tempId,
          slug: `draft-${tempId}`,
          title: "未命名文章",
          description: "",
          author: {
            id: user.id,
            name: user.name || "未命名用户",
          },
          articleContent: {
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
            version: 1,
            schema: "1.0.0",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // 存储到本地
        try {
          localStorage.setItem(
            `article-${tempId}`,
            JSON.stringify(tempArticle)
          );
          setArticle(tempArticle);

          // 同步到 Firebase
          console.log("开始同步文章到 Firebase...");
          console.log("文章数据:", tempArticle);
          await articleService.createArticle(tempArticle);
          console.log("文章同步成功");
        } catch (storageError) {
          console.error("存储文章失败:", storageError);
          throw new Error("无法保存文章，请检查网络连接");
        }

        // 延迟一秒后跳转，让用户有机会看到标题
        setTimeout(() => {
          router.push(`/editor/${tempId}`);
        }, 1000);
      } catch (err) {
        console.error("创建文章失败:", err);
        setError(err instanceof Error ? err.message : "创建文章失败，请重试");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      createTempArticle();
    } else {
      setIsLoading(false);
      setError("请先登录");
    }
  }, [router, user, isAuthenticated]);

  // 处理标题更改
  const handleTitleChange = async (newTitle: string) => {
    if (!article) return;

    const updatedArticle = {
      ...article,
      title: newTitle,
      updatedAt: new Date(),
    };

    setIsSaving(true);
    try {
      // 更新本地存储
      localStorage.setItem(
        `article-${article.id}`,
        JSON.stringify(updatedArticle)
      );
      setArticle(updatedArticle);

      // 同步到 Firebase
      await articleService.updateArticle(article.id, { title: newTitle });
    } catch (err) {
      console.error("更新标题失败:", err);
      // 这里我们不设置错误状态，因为这只是一个非关键性的更新
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => router.push("/")} className={styles.button}>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        {isLoading ? (
          <>
            <div className={styles.spinner} />
            <p>创建文章中，请稍候...</p>
          </>
        ) : article ? (
          <div className={styles.titleContainer}>
            <input
              type="text"
              value={article.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={styles.titleInput}
              placeholder="输入文章标题..."
              autoFocus
            />
            <p className={styles.hint}>
              {isSaving ? "保存中..." : "正在跳转到编辑器..."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
