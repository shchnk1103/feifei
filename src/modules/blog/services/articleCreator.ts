import { Article, ArticleContent } from "../types/blog";
import {
  ArticleCreator,
  BaseArticleOptions,
  TemplateArticleOptions,
  ImportArticleOptions,
  DraftArticleOptions,
} from "../types/creator";
import { ArticleError } from "../errors/ArticleError";
import { ArticleStorage } from "../storage/articleStorage";
import { authService } from "./authService";

// 定义模板接口
interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  articleContent: Article["articleContent"];
}

export class DefaultArticleCreator implements ArticleCreator {
  private articleStorage: ArticleStorage;

  constructor() {
    this.articleStorage = new ArticleStorage();
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  /**
   * 生成slug
   */
  private generateSlug(id: string): string {
    return `draft-${id}`;
  }

  /**
   * 创建初始内容
   */
  private createInitialContent(): ArticleContent {
    return {
      blocks: [],
      version: 1,
      schema: "1.0.0",
    };
  }

  /**
   * 创建初始元数据
   */
  private createInitialMetadata() {
    return {
      wordCount: 0,
      readingTime: 0,
      views: 0,
      likes: 0,
    };
  }

  /**
   * 获取当前作者信息
   */
  private async getCurrentAuthor() {
    const session = await authService.getSession();
    if (!session?.user) {
      throw new ArticleError("未登录", "AUTH_ERROR");
    }
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  }

  /**
   * 准备基础文章数据
   */
  private async prepareBaseArticle(
    options: BaseArticleOptions
  ): Promise<Article> {
    const id = this.generateId();
    const initialContent = this.createInitialContent();

    // 将 articleContent 转换为字符串格式的 content
    const content = JSON.stringify({
      blocks: initialContent.blocks,
      version: initialContent.version,
      schema: initialContent.schema,
    });

    return {
      id,
      slug: this.generateSlug(id),
      title: options.title || "未命名文章",
      description: options.description || "",
      author: await this.getCurrentAuthor(),
      imageSrc: "",
      articleContent: initialContent,
      content: content, // 使用转换后的内容
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      visibility: options.visibility,
      allowComments: options.allowComments,
      tags: options.tags || [],
      category: options.category,
      metadata: this.createInitialMetadata(),
    } as Article;
  }

  /**
   * 发送创建请求
   */
  private async sendCreateRequest(articleData: Article): Promise<Article> {
    try {
      console.log("发送创建文章请求，数据：", {
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        author: articleData.author,
        status: articleData.status,
      });

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await authService.getAuthToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(articleData),
      });

      const result = await response.json();
      console.log("服务器响应：", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: result,
      });

      if (!response.ok) {
        console.error("创建文章失败，详细信息：", {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details,
          validationErrors: result.validationErrors,
        });
        throw new ArticleError(
          `创建文章失败: ${
            result.message || result.error || response.statusText
          }`,
          result.code || "CREATE_ERROR"
        );
      }

      return result.data;
    } catch (error) {
      console.error("创建文章请求异常：", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * 创建空白文章
   */
  async createBlankArticle(options: BaseArticleOptions): Promise<Article> {
    try {
      console.log("开始创建空白文章，选项：", options);
      const articleData = await this.prepareBaseArticle(options);
      console.log("准备的文章数据：", {
        title: articleData.title,
        description: articleData.description,
        author: articleData.author,
        status: articleData.status,
      });

      const createdArticle = await this.sendCreateRequest(articleData);
      console.log("文章创建成功：", {
        id: createdArticle.id,
        title: createdArticle.title,
        author: createdArticle.author,
      });

      this.articleStorage.saveToLocal(createdArticle.id, createdArticle);
      return createdArticle;
    } catch (error) {
      console.error("创建空白文章失败，详细信息：", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        options,
      });
      throw error instanceof ArticleError
        ? error
        : new ArticleError(
            `创建空白文章失败: ${
              error instanceof Error ? error.message : String(error)
            }`,
            "CREATE_ERROR"
          );
    }
  }

  /**
   * 从模板创建文章
   */
  async createFromTemplate(options: TemplateArticleOptions): Promise<Article> {
    try {
      const articleData = await this.prepareBaseArticle(options);
      // 这里应该获取模板内容并合并
      const template = await this.getTemplate(options.templateId);
      articleData.articleContent = template.articleContent;

      const createdArticle = await this.sendCreateRequest(articleData);
      this.articleStorage.saveToLocal(createdArticle.id, createdArticle);
      return createdArticle;
    } catch (error) {
      console.error("从模板创建文章失败:", error);
      throw error instanceof ArticleError
        ? error
        : new ArticleError("从模板创建文章失败", "CREATE_ERROR");
    }
  }

  /**
   * 从导入创建文章
   */
  async createFromImport(options: ImportArticleOptions): Promise<Article> {
    try {
      const articleData = await this.prepareBaseArticle(options);
      // 这里应该处理导入的数据
      // TODO: 实现导入数据的处理逻辑

      const createdArticle = await this.sendCreateRequest(articleData);
      this.articleStorage.saveToLocal(createdArticle.id, createdArticle);
      return createdArticle;
    } catch (error) {
      console.error("从导入创建文章失败:", error);
      throw error instanceof ArticleError
        ? error
        : new ArticleError("从导入创建文章失败", "CREATE_ERROR");
    }
  }

  /**
   * 获取模板
   * @param templateId 模板ID
   * @returns 文章模板
   * @throws {ArticleError} 获取模板失败时抛出错误
   */
  private async getTemplate(templateId: string): Promise<ArticleTemplate> {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new ArticleError(
          result.message || "获取模板失败",
          result.code || "TEMPLATE_ERROR"
        );
      }

      return result.data;
    } catch (error) {
      console.error("获取模板失败:", error);
      throw error instanceof ArticleError
        ? error
        : new ArticleError("获取模板失败", "TEMPLATE_ERROR");
    }
  }

  /**
   * 打开已存在的草稿文章
   * @param options 草稿文章选项
   * @returns 文章数据
   */
  async openDraft(options: DraftArticleOptions): Promise<Article> {
    try {
      const { articleId } = options;

      // 从本地存储获取文章
      const article = this.articleStorage.getFromLocal(articleId);

      if (!article) {
        throw new ArticleError("找不到草稿文章", "NOT_FOUND");
      }

      // 如果需要，这里可以更新文章的访问时间或其他属性

      return article;
    } catch (error) {
      console.error("打开草稿文章失败:", error);
      throw error instanceof ArticleError
        ? error
        : new ArticleError("打开草稿文章失败", "OPEN_ERROR");
    }
  }

  /**
   * 删除草稿文章
   * @param articleId 文章ID
   * @returns 是否删除成功
   */
  async deleteDraft(articleId: string): Promise<boolean> {
    try {
      console.log(`开始删除草稿文章: ${articleId}`);

      // 1. 从本地存储删除
      const localDeleted = this.articleStorage.removeFromLocal(articleId);

      // 2. 尝试从数据库中删除（使用 POST 方法）
      try {
        const response = await fetch("/api/articles/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await authService.getAuthToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({ articleId }),
        });

        // 检查响应状态
        if (response.ok) {
          const data = await response.json();
          console.log(`文章在数据库中删除成功: ${articleId}`, data.message);
        } else {
          // 尝试读取错误信息
          try {
            const errorData = await response.json();

            // 特别处理权限错误
            if (response.status === 403) {
              console.warn(
                `权限错误: 没有权限删除文章 ${articleId}。${
                  errorData.details || ""
                }`,
                errorData
              );

              // 如果有必要，可以在这里向用户显示权限错误信息
              // 例如通过某种通知机制
              throw new ArticleError(
                `没有权限删除文章。${errorData.details || ""}`,
                "PERMISSION_ERROR"
              );
            } else {
              console.warn(
                `从数据库删除文章时出现问题: ${articleId}，状态码: ${response.status}`,
                errorData.error || errorData.message
              );
            }
          } catch {
            console.warn(
              `从数据库删除文章时出现问题: ${articleId}，状态码: ${response.status}`
            );
          }
        }
      } catch (dbError) {
        // 数据库删除失败，但不影响本地删除结果
        console.error(`从数据库删除文章失败: ${articleId}`, dbError);
      }

      // 3. 无论数据库删除是否成功，都返回本地删除结果
      return localDeleted;
    } catch (error) {
      console.error(`删除草稿文章失败: ${articleId}`, error);
      throw error instanceof ArticleError
        ? error
        : new ArticleError(`删除草稿文章失败: ${articleId}`, "DELETE_ERROR");
    }
  }
}
