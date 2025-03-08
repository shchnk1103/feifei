import {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  QuoteBlock,
} from "@/modules/editor/types/blocks";

// 文章状态
export type ArticleStatus = "draft" | "published" | "archived";

// 文章可见性
export type ArticleVisibility = "public" | "private";

// 只导出用于博客的块类型
export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | LinkBlock
  | QuoteBlock;

export interface ArticleMetadata {
  wordCount?: number;
  readingTime?: number;
  views?: number;
  likes?: number;
}

export interface ArticleContent {
  blocks: Block[]; // 使用完整的 Block 类型
  version: number;
  schema?: string; // 添加 schema 版本，便于后续内容结构升级
  lastEditedBy?: string; // 记录最后编辑者
}

export interface Article {
  // 基础信息
  id: string; // 改为 string 以适配数据库 ID
  slug: string; // URL 友好的标识符
  title: string;
  description: string;

  // 作者信息
  author: {
    id: string;
    name: string;
    avatar?: string;
  };

  // 内容
  imageSrc: string; // 封面图片
  articleContent: ArticleContent; // 使用新的 ArticleContent 接口

  // 时间相关
  createdAt: Date; // 改为 Date 类型
  updatedAt: Date;
  publishedAt?: Date;

  // 状态控制
  status: ArticleStatus;
  visibility: ArticleVisibility;
  allowComments: boolean;

  // 分类和标签
  tags: string[];
  category?: string;

  // 元数据
  metadata: ArticleMetadata;

  // SEO
  seoTitle?: string; // SEO 优化标题
  seoDescription?: string; // SEO 描述
}

// 创建文章时的默认值
export const DEFAULT_ARTICLE: Omit<Article, "id"> = {
  slug: "",
  title: "",
  description: "",
  author: {
    id: "",
    name: "",
  },
  imageSrc: "",
  articleContent: {
    blocks: [],
    version: 1,
    schema: "1.0.0",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "draft",
  visibility: "private",
  allowComments: true,
  tags: [],
  metadata: {
    wordCount: 0,
    readingTime: 0,
    views: 0,
    likes: 0,
  },
};
