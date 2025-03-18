import { Article } from "../types/blog";

export class ArticleStorage {
  /**
   * 从本地存储获取文章
   * @param {string} articleId - 文章ID
   * @returns {Article | null} 文章数据或null
   */
  getFromLocal(articleId: string): Article | null {
    try {
      const data = localStorage.getItem(`article-${articleId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("从本地存储获取文章失败:", error);
      return null;
    }
  }

  /**
   * 保存文章到本地存储
   * @param {string} articleId - 文章ID
   * @param {Article} article - 文章数据
   */
  saveToLocal(articleId: string, article: Article): void {
    try {
      localStorage.setItem(`article-${articleId}`, JSON.stringify(article));
    } catch (error) {
      console.error("保存到本地存储失败:", error);
    }
  }
}
