import { Article } from "../types/blog";

// 检查是否在浏览器环境
const isBrowser = typeof window !== "undefined";

// 存储键常量
const STORAGE_KEYS = {
  DRAFTS: "drafts",
  ARTICLES: "articles",
  DRAFT_INDEX: "draft-index", // 用于存储草稿的索引信息
};

// 草稿索引接口
interface DraftIndex {
  id: string;
  authorId: string;
  updatedAt: Date;
  title: string;
}

// 时间范围接口
interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export class ArticleStorage {
  /**
   * 获取草稿索引列表
   * @returns {DraftIndex[]} 草稿索引列表
   */
  private getDraftIndexes(): DraftIndex[] {
    if (!isBrowser) return [];

    try {
      const indexes = localStorage.getItem(STORAGE_KEYS.DRAFT_INDEX);
      return indexes ? JSON.parse(indexes) : [];
    } catch (error) {
      console.error("获取草稿索引失败:", error);
      return [];
    }
  }

  /**
   * 更新草稿索引
   * @param {Article} article - 文章数据
   */
  private updateDraftIndex(article: Article): void {
    if (!isBrowser || article.status !== "draft") return;

    try {
      const index: DraftIndex = {
        id: article.id,
        authorId: article.author.id,
        updatedAt: article.updatedAt,
        title: article.title,
      };

      const indexes = this.getDraftIndexes();
      const existingIndex = indexes.findIndex((i) => i.id === article.id);

      if (existingIndex >= 0) {
        indexes[existingIndex] = index;
      } else {
        indexes.push(index);
      }

      localStorage.setItem(STORAGE_KEYS.DRAFT_INDEX, JSON.stringify(indexes));
    } catch (error) {
      console.error("更新草稿索引失败:", error);
    }
  }

  /**
   * 从本地存储获取文章
   * @param {string} articleId - 文章ID
   * @returns {Article | null} 文章数据或null
   */
  getFromLocal(articleId: string): Article | null {
    if (!isBrowser) return null;

    try {
      // 先尝试从草稿中获取
      const draftData = localStorage.getItem(
        `${STORAGE_KEYS.DRAFTS}-${articleId}`
      );
      if (draftData) return JSON.parse(draftData);

      // 如果草稿中没有，尝试从已发布文章中获取
      const articleData = localStorage.getItem(
        `${STORAGE_KEYS.ARTICLES}-${articleId}`
      );
      return articleData ? JSON.parse(articleData) : null;
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
      const key =
        article.status === "draft"
          ? `${STORAGE_KEYS.DRAFTS}-${articleId}`
          : `${STORAGE_KEYS.ARTICLES}-${articleId}`;

      localStorage.setItem(key, JSON.stringify(article));

      // 如果是草稿，更新索引
      if (article.status === "draft") {
        this.updateDraftIndex(article);
      }
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
      const indexes = this.getDraftIndexes();
      return indexes
        .map((index) => this.getFromLocal(index.id))
        .filter((article): article is Article => article !== null)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
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
      // 删除草稿和已发布文章
      localStorage.removeItem(`${STORAGE_KEYS.DRAFTS}-${articleId}`);
      localStorage.removeItem(`${STORAGE_KEYS.ARTICLES}-${articleId}`);

      // 更新索引
      const indexes = this.getDraftIndexes();
      const newIndexes = indexes.filter((index) => index.id !== articleId);
      localStorage.setItem(
        STORAGE_KEYS.DRAFT_INDEX,
        JSON.stringify(newIndexes)
      );

      return true;
    } catch (error) {
      console.error("从本地存储删除文章失败:", error);
      return false;
    }
  }

  /**
   * 按作者ID获取草稿
   * @param {string} authorId - 作者ID
   * @returns {Article[]} 指定作者的草稿列表
   */
  getDraftsByAuthor(authorId: string): Article[] {
    if (!isBrowser) return [];

    try {
      const indexes = this.getDraftIndexes();
      const authorIndexes = indexes.filter(
        (index) => index.authorId === authorId
      );

      return authorIndexes
        .map((index) => this.getFromLocal(index.id))
        .filter((article): article is Article => article !== null)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
      console.error("获取作者草稿失败:", error);
      return [];
    }
  }

  /**
   * 按时间范围获取草稿
   * @param {TimeRange} range - 时间范围
   * @returns {Article[]} 指定时间范围内的草稿列表
   */
  getDraftsByTimeRange(range: TimeRange): Article[] {
    if (!isBrowser) return [];

    try {
      const indexes = this.getDraftIndexes();
      const timeFilteredIndexes = indexes.filter((index) => {
        const updatedAt = new Date(index.updatedAt);
        return updatedAt >= range.startDate && updatedAt <= range.endDate;
      });

      return timeFilteredIndexes
        .map((index) => this.getFromLocal(index.id))
        .filter((article): article is Article => article !== null)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
      console.error("获取时间范围内草稿失败:", error);
      return [];
    }
  }

  /**
   * 按作者和时间范围获取草稿
   * @param {string} authorId - 作者ID
   * @param {TimeRange} range - 时间范围
   * @returns {Article[]} 指定作者在指定时间范围内的草稿列表
   */
  getDraftsByAuthorAndTimeRange(authorId: string, range: TimeRange): Article[] {
    if (!isBrowser) return [];

    try {
      const indexes = this.getDraftIndexes();
      const filteredIndexes = indexes.filter((index) => {
        const isAuthorMatch = index.authorId === authorId;
        const updatedAt = new Date(index.updatedAt);
        const isTimeMatch =
          updatedAt >= range.startDate && updatedAt <= range.endDate;
        return isAuthorMatch && isTimeMatch;
      });

      return filteredIndexes
        .map((index) => this.getFromLocal(index.id))
        .filter((article): article is Article => article !== null)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
      console.error("获取作者时间范围内草稿失败:", error);
      return [];
    }
  }

  /**
   * 获取最近编辑的草稿
   * @param {number} limit - 返回的草稿数量限制
   * @returns {Article[]} 最近编辑的草稿列表
   */
  getRecentDrafts(limit: number = 10): Article[] {
    if (!isBrowser) return [];

    try {
      const indexes = this.getDraftIndexes();
      const sortedIndexes = [...indexes].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return sortedIndexes
        .slice(0, limit)
        .map((index) => this.getFromLocal(index.id))
        .filter((article): article is Article => article !== null);
    } catch (error) {
      console.error("获取最近草稿失败:", error);
      return [];
    }
  }

  /**
   * 从数据库获取指定作者的草稿列表
   * @param authorId 作者ID
   * @returns 草稿文章列表
   */
  async getDraftsFromDatabase(authorId: string): Promise<Article[]> {
    try {
      const response = await fetch(
        `/api/articles?authorId=${authorId}&status=draft&limit=100`
      );

      if (!response.ok) {
        throw new Error(`获取草稿失败: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error("返回的数据格式不正确");
      }

      // 确保返回的数据符合 Article 类型
      const articles = data.articles.map(
        (
          article: Omit<Article, "createdAt" | "updatedAt"> & {
            createdAt: { _seconds: number; _nanoseconds: number };
            updatedAt: { _seconds: number; _nanoseconds: number };
          }
        ) => {
          // 将 Firebase Timestamp 转换为 Date 对象
          const createdAt = new Date(article.createdAt._seconds * 1000);
          const updatedAt = new Date(article.updatedAt._seconds * 1000);

          return {
            ...article,
            createdAt,
            updatedAt,
          };
        }
      );

      return articles;
    } catch (error) {
      console.error("从数据库获取草稿失败:", error);
      return [];
    }
  }
}
