import { Article, ArticleStatus, ArticleVisibility } from "../types/blog";
import { CreateArticleOptions } from "../types/editor";
import { ArticleError } from "../errors/ArticleError";
import { DefaultArticleCreator } from "./articleCreator";
import { ArticleStorage } from "../storage/articleStorage";
import { ArticleApi } from "../api/articleApi";
import { ArticleValidator } from "../validators/articleValidator";
import { articles as staticArticles } from "@/data/articles";

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
 * Firestore时间戳接口
 */
export interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

/**
 * 简单的内容块接口
 */
export interface SimpleBlock {
  id: string;
  type: string;
  content: string;
  [key: string]: unknown;
}

/**
 * 扩展的作者类型，包含email字段
 */
interface ExtendedAuthor {
  id: string;
  name: string;
  avatar?: string;
  email?: string | null;
}

/**
 * 数据库文章接口
 */
export interface DBArticle {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  author: {
    id: string;
    name: string;
    email?: string | null;
    avatar?: string;
  };
  createdAt: FirestoreTimestamp | Date | string;
  updatedAt?: FirestoreTimestamp | Date | string;
  publishedAt?: FirestoreTimestamp | Date | string;
  tags?: string[];
  imageSrc?: string;
  coverImage?: string;
  articleContent?: {
    blocks: SimpleBlock[];
    version: number;
    schema: string;
  };
  status?: string;
  visibility?: string;
  allowComments?: boolean;
  category?: string;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    views?: number;
    likes?: number;
  };
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * API响应接口
 */
export interface ArticleApiResponse {
  articles: DBArticle[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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
        if (article) {
          this.validator.validate({ ...article, ...data });
        }
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
   * 从所有来源获取文章
   * 首先尝试从API获取，然后尝试从数据库获取，最后尝试从静态数据获取
   */
  async getArticleFromAllSources(id: string): Promise<Article | null> {
    try {
      // 首先尝试通过API获取
      const apiArticle = await this.getArticle(id);
      if (apiArticle) return apiArticle;

      // 然后尝试通过API端点从数据库获取
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (res.ok) {
          const dbArticle = await res.json();
          if (dbArticle) return normalizeArticle(dbArticle);
        }
      } catch (error) {
        console.error("通过API获取文章失败:", error);
      }

      // 最后尝试从静态数据获取
      const staticArticle = getArticleFromStatic(id);
      if (staticArticle) return staticArticle;

      return null;
    } catch (error) {
      console.error("从所有来源获取文章失败:", error);
      return null;
    }
  }

  /**
   * 获取所有文章（合并数据库和静态文章）
   */
  async getAllArticles(
    options: {
      includeStatic?: boolean;
      includeDB?: boolean;
      status?: string;
      visibility?: string;
      limit?: number;
    } = {}
  ): Promise<Article[]> {
    const {
      includeStatic = true,
      includeDB = true,
      status = "published",
      visibility = "public",
      limit = 10,
    } = options;

    try {
      let staticArticlesList: Article[] = [];
      let dbArticlesList: DBArticle[] = [];

      // 获取静态文章
      if (includeStatic) {
        staticArticlesList = staticArticles;
      }

      // 通过API获取数据库文章
      if (includeDB) {
        try {
          const params = new URLSearchParams({
            status,
            visibility,
            limit: limit.toString(),
          });
          const res = await fetch(`/api/articles?${params}`);
          if (res.ok) {
            const data: ArticleApiResponse = await res.json();
            dbArticlesList = data.articles || [];
          }
        } catch (error) {
          console.error("通过API获取数据库文章失败:", error);
        }
      }

      // 合并并返回
      return mergeArticles(staticArticlesList, dbArticlesList);
    } catch (error) {
      console.error("获取所有文章失败:", error);
      return includeStatic ? staticArticles : [];
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

/**
 * 安全处理日期
 */
export function safeDate(dateValue: unknown): Date {
  if (!dateValue) return new Date();

  try {
    // 处理Firestore Timestamp对象
    if (
      dateValue &&
      typeof dateValue === "object" &&
      "toDate" in dateValue &&
      typeof dateValue.toDate === "function"
    ) {
      return dateValue.toDate();
    }

    // 处理ISO日期字符串
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // 处理Date对象
    if (dateValue instanceof Date) {
      return dateValue;
    }

    // 无法处理的情况返回当前日期
    return new Date();
  } catch (error) {
    console.error("日期解析错误:", error);
    return new Date();
  }
}

/**
 * 从静态数据获取文章
 */
export function getArticleFromStatic(id: string): Article | null {
  return staticArticles.find((article) => article.id === id) || null;
}

/**
 * 检查对象是否包含email属性
 */
function hasEmail(obj: unknown): obj is { email: string | null } {
  return Boolean(obj && typeof obj === "object" && "email" in obj);
}

/**
 * 标准化文章 - 统一DB文章和客户端文章格式
 */
export function normalizeArticle(article: DBArticle | Article): Article {
  // 创建一个扩展的作者对象，包含可能的email字段
  const authorWithEmail: ExtendedAuthor = {
    id: article.author?.id || "system",
    name: article.author?.name || "系统",
    avatar: article.author?.avatar || "",
  };

  // 如果是数据库文章，可能有email字段
  if (hasEmail(article.author)) {
    authorWithEmail.email = article.author.email;
  }

  // 处理图片字段，处理coverImage和imageSrc的兼容
  const imageSrc =
    article.imageSrc ||
    ("coverImage" in article ? (article.coverImage as string) : "") ||
    "";

  // 构建规范化的文章对象
  return {
    id: article.id,
    slug: article.slug || article.id,
    title: article.title || "无标题",
    description: article.description || "",
    content: article.content || "",
    author: authorWithEmail,
    createdAt: safeDate(article.createdAt),
    updatedAt: article.updatedAt ? safeDate(article.updatedAt) : undefined,
    publishedAt: article.publishedAt
      ? safeDate(article.publishedAt)
      : undefined,
    tags: article.tags || [],
    imageSrc: imageSrc,
    articleContent: article.articleContent || {
      blocks: [],
      version: 1,
      schema: "default",
    },
    status: (article.status || "draft") as ArticleStatus,
    visibility: (article.visibility || "private") as ArticleVisibility,
    allowComments: Boolean(article.allowComments),
    category: article.category || "未分类",
    metadata: {
      wordCount: article.metadata?.wordCount || 0,
      readingTime: article.metadata?.readingTime || 0,
      views: article.metadata?.views || 0,
      likes: article.metadata?.likes || 0,
    },
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || article.description || "",
  } as Article;
}

/**
 * 合并文章列表
 */
export function mergeArticles(
  staticArticles: Article[] = [],
  dbArticles: DBArticle[] = []
): Article[] {
  // 标准化数据库文章
  const normalizedDbArticles = dbArticles.map(normalizeArticle);

  // 合并两个数组
  const allArticles = [...staticArticles, ...normalizedDbArticles];

  // 按ID去重
  const uniqueArticles = allArticles.reduce<Article[]>((acc, article) => {
    if (!acc.some((a) => a.id === article.id)) {
      acc.push(article);
    }
    return acc;
  }, []);

  // 按发布日期排序（最新的在前）
  return uniqueArticles.sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * 获取所有文章ID
 */
export async function getAllArticleIds(): Promise<string[]> {
  const staticIds = staticArticles.map((article) => article.id);

  // 通过API获取数据库文章ID
  try {
    const res = await fetch("/api/articles?fields=id");
    if (res.ok) {
      const data = await res.json();
      const dbIds = data.articles.map((article: DBArticle) => article.id);

      // 合并并去重
      return [...new Set([...staticIds, ...dbIds])];
    }
  } catch (error) {
    console.error("获取数据库文章ID失败:", error);
  }

  return staticIds;
}

/**
 * @deprecated 此函数只应在服务器端API路由中使用，不应在此模块中使用
 */
export async function getArticleFromDB(/* id: string */): Promise<DBArticle | null> {
  console.warn("getArticleFromDB被调用，此函数应只在服务器端API路由中使用");
  // 返回一个空实现
  return null;
}

/**
 * @deprecated 此函数只应在服务器端API路由中使用，不应在此模块中使用
 */
export async function getArticlesFromDB(): Promise<DBArticle[]> {
  /* options: {
    status?: string;
    visibility?: string;
    limit?: number;
  } = {} */
  console.warn("getArticlesFromDB被调用，此函数应只在服务器端API路由中使用");
  // 返回一个空实现
  return [];
}
