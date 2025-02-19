import {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  QuoteBlock,
} from "./blocks";

// 只导出用于博客的块类型
export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | LinkBlock
  | QuoteBlock;

export interface Article {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
  articleContent: {
    blocks: ContentBlock[];
  };
  author: string;
  createdAt: string;
  tags: string[];
}
