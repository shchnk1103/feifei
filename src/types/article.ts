import type { ContentBlock } from "./blog";

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
