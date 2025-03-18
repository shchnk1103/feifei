import { Article } from "../types/blog";
import { ArticleError } from "../errors/ArticleError";

// API 响应类型定义
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export class ArticleApi {
  /**
   * 创建文章
   */
  async create(article: Article): Promise<Article> {
    const response = await this.request<Article>("/api/articles", {
      method: "POST",
      body: JSON.stringify(article),
    });
    return response.data;
  }

  /**
   * 更新文章
   */
  async update(articleId: string, data: Partial<Article>): Promise<void> {
    await this.request<void>(`/api/articles/${articleId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * 获取文章
   */
  async get(articleId: string): Promise<Article | null> {
    try {
      const response = await this.request<Article>(
        `/api/articles/${articleId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof ArticleError && error.code === "NOT_FOUND") {
        return null;
      }
      throw error;
    }
  }

  /**
   * 发送请求
   * @template T - 响应数据类型
   * @param url - 请求URL
   * @param options - 请求选项
   * @returns Promise<ApiResponse<T>> - API响应
   * @throws {ArticleError} 当请求失败时抛出
   */
  private async request<T>(
    url: string,
    options: Omit<RequestInit, "body"> & { body?: string } = {}
  ): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new ArticleError(
        result.message || "请求失败",
        result.code || "API_ERROR"
      );
    }

    return result as ApiResponse<T>;
  }
}
