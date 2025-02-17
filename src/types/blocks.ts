export type ContentBlockType =
  | "text"
  | "heading"
  | "image"
  | "link"
  | "music"
  | "quote"
  | "code"
  | "table"
  | "divider";

// 基础块接口
interface BaseBlock {
  id: string;
  type: ContentBlockType;
  content: string;
}

// 文本块接口
export interface TextBlock extends BaseBlock {
  type: "text";
}

// 标题块接口
export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// 图片块接口
export interface ImageBlock extends BaseBlock {
  type: "image";
  metadata: {
    imageUrl: string;
    description?: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

// 链接块接口
export interface LinkBlock extends BaseBlock {
  type: "link";
  metadata: {
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    favicon?: string;
  };
}

// 音乐块接口
export interface MusicBlock extends BaseBlock {
  type: "music";
  metadata: {
    musicUrl: string;
    artist: string;
    albumName?: string;
    coverUrl?: string;
    duration?: string;
    description?: string;
    lyrics?: string;
  };
}

// 引用块接口
export interface QuoteBlock extends BaseBlock {
  type: "quote";
  metadata: {
    author?: string;
    source?: string;
    date?: string;
  };
}

// 代码块接口
export interface CodeBlock extends BaseBlock {
  type: "code";
  metadata: {
    language: string;
    fileName?: string;
    lineNumbers?: boolean;
    highlightedLines?: number[];
  };
}

// 表格块接口
export interface TableBlock extends BaseBlock {
  type: "table";
  metadata: {
    headers: string[];
    rows: string[][];
    caption?: string;
    alignment?: ("left" | "center" | "right")[];
  };
}

// 分割线块接口
export interface DividerBlock extends BaseBlock {
  type: "divider";
  metadata?: {
    style?: "solid" | "dashed" | "dotted";
  };
}

// 导出统一的内容块类型
export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | LinkBlock
  | MusicBlock
  | QuoteBlock
  | CodeBlock
  | TableBlock
  | DividerBlock;

// 块元数据工具类型
export type BlockMetadata<T extends Block> = T extends { metadata: infer M }
  ? M
  : never;
