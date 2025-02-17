import type { ContentBlock } from "./blog";

// 只保留 Article 相关的类型定义
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
