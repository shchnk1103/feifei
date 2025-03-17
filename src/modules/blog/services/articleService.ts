import { Article } from "../types/blog";

/**
 * 文章服务
 *
 * 提供文章相关的业务逻辑操作，包括：
 * - 创建文章
 * - 更新文章
 * - 获取文章
 * - 同步文章
 *
 * @module blog/services/articleService
 */

/**
 * 文章服务接口
 */
export const articleService = {
  /**
   * 获取认证令牌
   *
   * @returns {Promise<string>} 认证令牌
   */
  async getAuthToken(): Promise<string> {
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      return session?.token || "";
    } catch (error) {
      console.error("获取认证令牌失败:", error);
      return "";
    }
  },

  /**
   * 创建新文章
   *
   * @param {Article} article - 要创建的文章数据
   * @returns {Promise<Article>} 创建成功的文章数据
   *
   * @throws {Error} 创建文章失败时抛出错误
   *
   * @example
   * ```typescript
   * const article = {
   *   title: "文章标题",
   *   content: "文章内容",
   *   // ... 其他文章字段
   * };
   * const createdArticle = await articleService.createArticle(article);
   * ```
   */
  async createArticle(article: Article): Promise<Article> {
    try {
      // 确保文章数据结构正确
      const articleData = {
        ...article,
        articleContent: article.articleContent || {
          blocks: [],
          version: 1,
          schema: "1.0.0",
        },
      };

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "创建文章失败");
      }

      return result.data;
    } catch (error) {
      console.error("创建文章失败:", error);
      throw error instanceof Error ? error : new Error("创建文章失败");
    }
  },

  /**
   * 更新文章
   *
   * @param {string} articleId - 文章ID
   * @param {Partial<Article>} data - 要更新的文章数据
   * @returns {Promise<void>}
   *
   * @throws {Error} 更新文章失败时抛出错误
   *
   * @example
   * ```typescript
   * await articleService.updateArticle("article-id", {
   *   title: "新标题",
   *   content: "新内容"
   * });
   * ```
   */
  async updateArticle(
    articleId: string,
    data: Partial<Article>
  ): Promise<void> {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "更新文章失败");
      }
    } catch (error) {
      console.error("更新文章失败:", error);
      throw error instanceof Error ? error : new Error("更新文章失败");
    }
  },

  /**
   * 获取文章
   *
   * @param {string} articleId - 文章ID
   * @returns {Promise<Article | null>} 文章数据，如果不存在则返回 null
   *
   * @throws {Error} 获取文章失败时抛出错误
   *
   * @example
   * ```typescript
   * const article = await articleService.getArticle("article-id");
   * if (article) {
   *   console.log(article.title);
   * }
   * ```
   */
  async getArticle(articleId: string): Promise<Article | null> {
    try {
      const response = await fetch(`/api/articles/${articleId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(result.message || result.error || "获取文章失败");
      }

      return result.data;
    } catch (error) {
      console.error("获取文章失败:", error);
      throw error instanceof Error ? error : new Error("获取文章失败");
    }
  },

  /**
   * 同步本地文章到数据库
   *
   * 如果文章已存在则更新，不存在则创建
   *
   * @param {Article} article - 要同步的文章数据
   * @returns {Promise<Article>} 同步后的文章数据
   *
   * @throws {Error} 同步文章失败时抛出错误
   *
   * @example
   * ```typescript
   * const article = {
   *   id: "article-id",
   *   title: "文章标题",
   *   content: "文章内容"
   * };
   * const syncedArticle = await articleService.syncArticle(article);
   * ```
   */
  async syncArticle(article: Article): Promise<Article> {
    try {
      const existingArticle = await this.getArticle(article.id);

      if (existingArticle) {
        // 如果文章已存在，则更新
        await this.updateArticle(article.id, article);
        return article;
      } else {
        // 如果文章不存在，则创建
        return await this.createArticle(article);
      }
    } catch (error) {
      console.error("同步文章失败:", error);
      throw error instanceof Error ? error : new Error("同步文章失败");
    }
  },
};
