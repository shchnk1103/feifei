import { ContentBlock } from "./blog";

export type ContentBlockType =
  | "text"
  | "heading"
  | "image"
  | "link"
  | "music" // 添加音乐类型
  | "quote";

export interface ContentBlock {
  id: string; // 用于 React key
  type: ContentBlockType;
  content: string; // 主要内容
  level?: number; // 用于标题层级 (h1-h6)
  metadata?: {
    title?: string; // 音乐标题、链接标题等
    url?: string; // 链接地址、音乐地址等
    imageUrl?: string; // 图片地址、音乐封面等
    artist?: string; // 音乐艺术家
    description?: string; // 链接描述等
    musicUrl?: string; // 音乐文件地址
    albumName?: string; // 专辑名称
    coverUrl?: string; // 专辑封面
    duration?: string; // 音乐时长
    author?: string; // 引用作者
    source?: string; // 引用来源
  };
}

export interface ArticleContent {
  blocks: ContentBlock[];
}

export interface Article {
  id: number | string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  imageSrc: string;
  articleContent: {
    blocks: ContentBlock[];
  };
}
