"use client";

import { useState, useEffect } from "react";
import { Article, ArticleStatus, DEFAULT_ARTICLE } from "@/types/blog";

export function useArticle(articleId: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError(null);

      try {
        // 生产环境中，这里应该从API获取文章
        // 但现在先创建一个模拟的文章

        // 如果ID以draft开头，说明是新建的文章
        const isDraft = articleId.startsWith("draft-");

        if (isDraft) {
          // 创建一个新的草稿文章
          const mockArticle: Article = {
            ...DEFAULT_ARTICLE,
            id: articleId,
            slug: `draft-${Date.now()}`,
            title: "未命名文章",
            description: "",
            author: {
              id: "current-user", // 应该是当前登录用户的ID
              name: "当前用户",
            },
            imageSrc: "",
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
            status: "draft",
            visibility: "private",
            allowComments: true,
            tags: [],
            metadata: {
              wordCount: 0,
              readingTime: 0,
              views: 0,
              likes: 0,
            },
          };

          // 模拟异步加载
          setTimeout(() => {
            setArticle(mockArticle);
            setLoading(false);
          }, 500);
        } else {
          // 在实际应用中应该从API加载现有文章
          // const response = await fetch(`/api/articles/${articleId}`);
          // const data = await response.json();
          // setArticle(data);

          // 暂时用模拟数据
          const mockArticle: Article = {
            ...DEFAULT_ARTICLE,
            id: articleId,
            slug: `article-${articleId}`,
            title: "加载中的文章",
            description: "文章描述...",
            author: {
              id: "user-1",
              name: "示例用户",
              avatar: "https://i.pravatar.cc/300",
            },
            imageSrc: "https://source.unsplash.com/random/1200x600/?nature",
            articleContent: {
              blocks: [
                {
                  id: "block-1",
                  type: "heading",
                  content: "示例文章",
                  level: 1,
                },
                {
                  id: "block-2",
                  type: "text",
                  content: "这是一个示例文章的内容。",
                },
              ],
              version: 1,
              schema: "1.0.0",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: new Date(),
            status: "published",
            visibility: "public",
            allowComments: true,
            tags: ["示例", "测试"],
            category: "教程",
            metadata: {
              wordCount: 100,
              readingTime: 1,
              views: 50,
              likes: 5,
            },
          };

          setTimeout(() => {
            setArticle(mockArticle);
            setLoading(false);
          }, 500);
        }
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError("加载文章失败，请稍后再试");
        setLoading(false);
      }
    }

    fetchArticle();
  }, [articleId]);

  // 更新文章的函数
  const updateArticle = async (updatedArticle: Article) => {
    try {
      // 实际应用中，这里应该调用API
      // const response = await fetch(`/api/articles/${articleId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedArticle),
      // });

      // 更新本地状态
      setArticle({
        ...updatedArticle,
        updatedAt: new Date(), // 更新修改时间
      });

      // 返回更新后的文章
      return updatedArticle;
    } catch (err) {
      console.error("Failed to update article:", err);
      throw new Error("更新文章失败");
    }
  };

  return { article, loading, error, updateArticle };
}
