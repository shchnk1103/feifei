import { v4 as uuidv4 } from "uuid";

// 文章类型定义
export interface Article {
  id: string;
  title: string;
  coverImage?: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: "draft" | "published";
  userId: string;
}

export interface Block {
  id: string;
  type: "text" | "heading" | "image" | "quote" | "code" | "divider";
  content: string;
  level?: number; // 用于 heading 块
  metadata?: {
    [key: string]: any;
  };
}

// 模拟数据存储
const articles: Article[] = [
  {
    id: "1",
    title: "示例文章",
    coverImage: "",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    userId: "user-1",
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

// 确认 createArticle 正确实现
export async function createArticle(userId: string): Promise<Article> {
  // 模拟API请求延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 创建新文章对象
  const newArticle: Article = {
    id: uuidv4(), // 使用uuid生成唯一ID
    title: "未命名文章",
    coverImage: "",
    blocks: [
      {
        id: uuidv4(),
        type: "text",
        content: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    userId: userId,
  };

  // 添加到文章列表
  articles.push(newArticle);

  return newArticle;
}

// 更新文章
export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt" | "userId">>
): Promise<Article | null> {
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return null;

  const updatedArticle = {
    ...articles[index],
    ...data,
    updatedAt: new Date().toISOString(),
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
    status: "published",
    publishedAt: new Date().toISOString(),
  });
}
