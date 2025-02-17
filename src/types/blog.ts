export interface BaseBlock {
  id: string;
  type: string;
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextBlock extends BaseBlock {
  type: "text";
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  metadata: {
    imageUrl: string;
    description?: string;
  };
}

export interface LinkBlock extends BaseBlock {
  type: "link";
  metadata: {
    url: string;
    imageUrl?: string;
    description?: string;
  };
}

export interface MusicBlock extends BaseBlock {
  type: "music";
  metadata: {
    coverUrl: string;
    musicUrl: string;
    title: string;
    artist: string;
    albumName: string;
    description?: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  metadata?: {
    author?: string;
    source?: string;
    date?: string; // 添加可选的 date 字段
  };
}

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | LinkBlock
  | MusicBlock
  | QuoteBlock;
