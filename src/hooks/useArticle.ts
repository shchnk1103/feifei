"use client";

import { useState, useEffect } from "react";
import { Article, DEFAULT_ARTICLE } from "@/types/blog";

/**
 * useArticle - 用于获取和更新文章内容的自定义Hook
 *
 * @description
 * 这个Hook负责文章的加载、状态管理和更新操作。它支持从API或本地缓存获取文章，
 * 并提供更新文章的功能。在加载过程中会显示加载状态，发生错误时会显示错误信息。
 *
 * @template T - 文章类型，默认为Article，必须是Article的子类型
 * @template U - 可更新的文章字段类型，默认包含id字段和T的可选字段
 *
 * @param {string} articleId - 要获取的文章ID
 *
 * @returns {Object} 返回包含以下属性的对象:
 *   - article: T | null - 加载的文章数据，可能为null（如加载中或出错时）
 *   - loading: boolean - 指示文章是否正在加载
 *   - error: string | null - 如果发生错误，包含错误信息
 *   - updateArticle: (updatedArticle: U & { id: string }) => Promise<U & { id: string }> -
 *     用于更新文章的函数，接收包含id的部分文章数据，返回更新后的数据
 *
 * @example
 * // 基本用法
 * const { article, loading, error, updateArticle } = useArticle("article-123");
 *
 * // 使用自定义类型
 * interface ExtendedArticle extends Article {
 *   customField: string;
 * }
 *
 * type UpdateFields = {
 *   id: string;
 *   title?: string;
 *   content?: string;
 * }
 *
 * const { article, updateArticle } = useArticle<ExtendedArticle, UpdateFields>("article-123");
 *
 * // 更新文章
 * const handleUpdate = async () => {
 *   try {
 *     await updateArticle({
 *       id: "article-123",
 *       title: "新标题"
 *     });
 *     console.log("更新成功");
 *   } catch (err) {
 *     console.error("更新失败", err);
 *   }
 * }
 */
export function useArticle<
  T extends Article = Article,
  U = { id: string } & Partial<Omit<T, "id">>
>(articleId: string) {
  const [article, setArticle] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 文章加载逻辑
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
          // 首先创建符合 Article 接口的对象
          const mockArticleBase: Article = {
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

          // 然后通过 unknown 中间类型安全地转换为 T
          // 这表明我们知道这是一个类型断言，并且接受相关风险
          const mockArticle = mockArticleBase as unknown as T;

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
          const mockArticleBase: Article = {
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

          // 安全地转换为 T
          const mockArticle = mockArticleBase as unknown as T;

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

  /**
   * 更新文章的函数
   *
   * @param {U & { id: string }} updatedArticle - 包含要更新的文章字段和ID
   * @returns {Promise<U & { id: string }>} 返回更新后的文章数据
   * @throws {Error} 如果更新失败，会抛出错误
   */
  const updateArticle = async (updatedArticle: U & { id: string }) => {
    try {
      // 实际应用中，这里应该调用API
      // const response = await fetch(`/api/articles/${articleId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedArticle),
      // });

      // 更新本地状态
      if (article) {
        setArticle({
          ...article,
          ...updatedArticle,
          updatedAt: new Date(), // 更新修改时间
        } as unknown as T);
      }

      // 返回更新后的文章
      return updatedArticle;
    } catch (err) {
      console.error("Failed to update article:", err);
      throw new Error("更新文章失败");
    }
  };

  return { article, loading, error, updateArticle };
}
