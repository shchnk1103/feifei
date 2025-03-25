import { Article } from "../types/blog";

// 检查是否在浏览器环境
const isBrowser = typeof window !== "undefined";

export class ArticleStorage {
  /**
   * 从本地存储获取文章
   * @param {string} articleId - 文章ID
   * @returns {Article | null} 文章数据或null
   */
  getFromLocal(articleId: string): Article | null {
    if (!isBrowser) return null;

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
    if (!isBrowser) return;

    try {
      localStorage.setItem(`article-${articleId}`, JSON.stringify(article));
    } catch (error) {
      console.error("保存到本地存储失败:", error);
    }
  }

  /**
   * 获取所有本地草稿文章
   * @returns {Article[]} 草稿文章列表
   */
  getAllDrafts(): Article[] {
    if (!isBrowser) return [];

    try {
      const drafts: Article[] = [];
      // 遍历localStorage中所有key
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // 检查是否是文章key
        if (key && key.startsWith("article-")) {
          const articleId = key.replace("article-", "");
          const article = this.getFromLocal(articleId);
          // 只返回未发布的草稿
          if (article && article.status !== "published") {
            drafts.push(article);
          }
        }
      }
      // 按最后修改时间排序，最新的在前面
      return drafts.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("获取本地草稿失败:", error);
      return [];
    }
  }

  /**
   * 从本地存储删除文章
   * @param {string} articleId - 文章ID
   * @returns {boolean} 删除是否成功
   */
  removeFromLocal(articleId: string): boolean {
    if (!isBrowser) return false;

    try {
      localStorage.removeItem(`article-${articleId}`);
      return true;
    } catch (error) {
      console.error("从本地存储删除文章失败:", error);
      return false;
    }
  }
}
