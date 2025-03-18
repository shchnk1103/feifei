import { Article, ArticleStatus, ArticleVisibility } from "../types/blog";
import { CreateArticleOptions } from "../types/editor";
import { ArticleError } from "../errors/ArticleError";
import { DefaultArticleCreator } from "./articleCreator";
import { ArticleStorage } from "../storage/articleStorage";
import { ArticleApi } from "../api/articleApi";
import { ArticleValidator } from "../validators/articleValidator";

/**
 * 文章服务
 *
 * 提供文章相关的业务逻辑操作，包括：
 * - 创建文章
 * - 更新文章
 * - 获取文章
 * - 同步文章
 * - 文章模板管理
 *
 * @module blog/services/articleService
 */

/**
 * 文章服务类
 */
class ArticleService {
  private readonly creator: DefaultArticleCreator;
  private readonly storage: ArticleStorage;
  private readonly api: ArticleApi;
  private readonly validator: ArticleValidator;

  constructor() {
    this.creator = new DefaultArticleCreator();
    this.storage = new ArticleStorage();
    this.api = new ArticleApi();
    this.validator = new ArticleValidator();
  }

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
      throw new ArticleError("获取认证失败", "AUTH_ERROR");
    }
  }

  /**
   * 创建新文章
   */
  async createArticle(options: CreateArticleOptions): Promise<Article> {
    try {
      switch (options.type) {
        case "blank":
          return await this.creator.createBlankArticle(options);
        case "template":
          return await this.creator.createFromTemplate({
            ...options,
            templateId: options.templateId!,
          });
        case "import":
          return await this.creator.createFromImport({
            ...options,
            importData: {},
          });
        default:
          throw new ArticleError("无效的文章类型", "INVALID_TYPE");
      }
    } catch (error) {
      this.handleError(error, "创建文章失败");
    }
  }

  /**
   * 更新文章
   */
  async updateArticle(
    articleId: string,
    data: Partial<Article>
  ): Promise<void> {
    try {
      if (data.title || data.status === "published") {
        const article = await this.getArticle(articleId);
        this.validator.validate({ ...article, ...data });
      }
      await this.api.update(articleId, data);
    } catch (error) {
      this.handleError(error, "更新文章失败");
    }
  }

  /**
   * 获取文章
   */
  async getArticle(articleId: string): Promise<Article | null> {
    try {
      const localArticle = this.storage.getFromLocal(articleId);
      if (localArticle) return localArticle;

      const article = await this.api.get(articleId);
      if (article) {
        this.storage.saveToLocal(articleId, article);
      }
      return article;
    } catch (error) {
      this.handleError(error, "获取文章失败");
    }
  }

  /**
   * 同步文章
   */
  async syncArticle(article: Article): Promise<Article> {
    try {
      const existingArticle = await this.getArticle(article.id);
      if (existingArticle) {
        await this.updateArticle(article.id, article);
        return article;
      }

      const newArticle = await this.creator.createBlankArticle({
        title: article.title,
        description: article.description,
        visibility: article.visibility,
        allowComments: article.allowComments,
        tags: article.tags,
        category: article.category,
      });
      await this.updateArticle(newArticle.id, article);
      return article;
    } catch (error) {
      this.handleError(error, "同步文章失败");
    }
  }

  /**
   * 发布文章
   */
  async publishArticle(articleId: string): Promise<Article> {
    try {
      const article = await this.getArticle(articleId);
      if (!article) {
        throw new ArticleError("文章不存在", "NOT_FOUND");
      }

      const publishData = {
        status: "published" as ArticleStatus,
        publishedAt: new Date(),
        visibility: "public" as ArticleVisibility,
      };

      await this.updateArticle(articleId, publishData);
      return { ...article, ...publishData };
    } catch (error) {
      this.handleError(error, "发布文章失败");
    }
  }

  /**
   * 统一错误处理
   */
  private handleError(error: unknown, message: string): never {
    console.error(`${message}:`, error);
    throw error instanceof ArticleError
      ? error
      : new ArticleError(message, "UNKNOWN_ERROR");
  }
}

// 导出文章服务实例
export const articleService = new ArticleService();
