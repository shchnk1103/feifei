"use client";

import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { Article } from "@/modules/blog/types/blog";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";

interface ArticleClientPageProps {
  article: Article;
}

export function ArticleClientPage({ article }: ArticleClientPageProps) {
  const [likes, setLikes] = useState(article.metadata?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // 检查用户是否已经点赞过这篇文章
  useEffect(() => {
    if (user) {
      // 这里可以从本地存储或API获取用户点赞状态
      const likedArticles = localStorage.getItem("likedArticles");
      if (likedArticles) {
        const likedArray = JSON.parse(likedArticles);
        setHasLiked(likedArray.includes(article.id));
      }
    }
  }, [article.id, user]);

  // 处理点赞功能
  const handleLike = async () => {
    if (!user) {
      // 未登录用户可以提示登录
      // 或者允许点赞但不保存状态
      return;
    }

    // 切换点赞状态
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);

    // 更新本地点赞数
    const newLikes = newLikedState ? likes + 1 : likes - 1;
    setLikes(newLikes);

    // 保存点赞状态到本地存储
    const likedArticles = localStorage.getItem("likedArticles");
    let likedArray = likedArticles ? JSON.parse(likedArticles) : [];

    if (newLikedState) {
      likedArray.push(article.id);
    } else {
      likedArray = likedArray.filter((id: string) => id !== article.id);
    }

    localStorage.setItem("likedArticles", JSON.stringify(likedArray));

    // 这里可以向API发送点赞更新请求
    try {
      await fetch(`/api/articles/${article.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ liked: newLikedState }),
      });
    } catch (error) {
      console.error("更新点赞状态失败:", error);
      // 如果API调用失败，恢复到之前的状态
      setHasLiked(!newLikedState);
      setLikes(newLikedState ? likes - 1 : likes + 1);
    }
  };

  // 处理文章编辑
  const handleEdit = () => {
    router.push(`/editor/${article.id}`);
  };

  return (
    <article className={styles.article}>
      <ArticleHeader
        title={article.title}
        author={article.author}
        createdAt={article.createdAt}
        tags={article.tags}
        coverImage={article.imageSrc}
      />

      <ArticleContent
        blocks={article.articleContent.blocks}
        version={article.articleContent.version}
        schema={article.articleContent.schema || ""}
      />

      <div className={styles.articleActions}>
        <button
          className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
          onClick={handleLike}
        >
          {likes} 赞
        </button>

        {user && (user.uid === article.author.id || user.role === "admin") && (
          <button className={styles.editButton} onClick={handleEdit}>
            编辑文章
          </button>
        )}
      </div>
    </article>
  );
}
