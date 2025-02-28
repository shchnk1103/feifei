import { Article, ArticleStatus, ArticleVisibility } from "@/types/blog";
import { v4 as uuidv4 } from "uuid";

// 模拟数据存储 - 使用从 @/types/blog 导入的 Article 类型
const articles: Article[] = [
  {
    id: "1",
    slug: "example-article",
    title: "示例文章",
    description: "这是一篇示例文章的描述。",
    author: {
      id: "user-1",
      name: "示例作者",
    },
    imageSrc: "",
    articleContent: {
      blocks: [
        {
          id: "block-1",
          type: "heading",
          content: "这是一篇示例文章",
          level: 1,
        },
        {
          id: "block-2",
          type: "text",
          content: "这是示例内容，你可以编辑它来测试编辑器功能。",
        },
      ],
      version: 1,
      schema: "1.0.0",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "draft",
    visibility: "public",
    allowComments: true,
    tags: ["示例", "测试"],
    metadata: {
      wordCount: 20,
      readingTime: 1,
      views: 0,
      likes: 0,
    },
  },
];

// 获取单个文章
export async function getArticleById(id: string): Promise<Article | null> {
  // 模拟从API获取数据的延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  const article = articles.find((a) => a.id === id);
  return article || null;
}

// 获取所有文章
export async function getAllArticles(): Promise<Article[]> {
  // 模拟从API获取数据的延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [...articles];
}

// 创建新文章
export async function createArticle(userId: string): Promise<Article> {
  // 模拟API请求延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 创建新文章对象
  const newArticle: Article = {
    id: uuidv4(),
    slug: `article-${Date.now()}`,
    title: "未命名文章",
    description: "",
    author: {
      id: userId,
      name: "用户",
    },
    imageSrc: "",
    articleContent: {
      blocks: [
        {
          id: uuidv4(),
          type: "text",
          content: "",
        },
      ],
      version: 1,
      schema: "1.0.0",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "draft" as ArticleStatus,
    visibility: "private" as ArticleVisibility,
    allowComments: true,
    tags: [],
    metadata: {
      wordCount: 0,
      readingTime: 0,
      views: 0,
      likes: 0,
    },
  };

  // 添加到文章列表
  articles.push(newArticle);

  return newArticle;
}

// 更新文章
export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt" | "author">>
): Promise<Article | null> {
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return null;

  const updatedArticle = {
    ...articles[index],
    ...data,
    updatedAt: new Date(),
  };

  articles[index] = updatedArticle;
  return updatedArticle;
}

// 删除文章
export async function deleteArticle(id: string): Promise<boolean> {
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return false;

  articles.splice(index, 1);
  return true;
}

// 发布文章
export async function publishArticle(id: string): Promise<Article | null> {
  const article = await getArticleById(id);

  if (!article) return null;

  return updateArticle(id, {
    status: "published" as ArticleStatus,
    updatedAt: new Date(),
  });
}
