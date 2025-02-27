// 基础块类型
export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "quote"
  | "code"
  | "divider"
  | "link"
  | "table"; // 添加表格类型

// 块的基础接口
export interface Block {
  id: string; // 块的唯一标识
  type: BlockType; // 块的类型
  content: string; // 文本内容
  level?: number; // 用于标题块的级别
  metadata?: {
    // 额外的元数据
    [key: string]: any; // 不同类型的块可能有不同的元数据
  };
}

// 文本块
export interface TextBlock extends Block {
  type: "text";
  content: string;
}

// 标题块
export interface HeadingBlock extends Block {
  type: "heading";
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// 图片块
export interface ImageBlock extends Block {
  type: "image";
  metadata: {
    imageUrl: string; // 图片URL
    alt?: string; // 替代文本
    caption?: string; // 图片说明
    width?: number; // 宽度
    height?: number; // 高度
  };
}

// 引用块
export interface QuoteBlock extends Block {
  type: "quote";
  content: string;
  metadata?: {
    author?: string; // 引用作者
    source?: string; // 引用来源
  };
}

// 代码块
export interface CodeBlock extends Block {
  type: "code";
  content: string;
  metadata?: {
    language?: string; // 代码语言
    highlightLines?: number[]; // 高亮行
  };
}

// 分隔线块
export interface DividerBlock extends Block {
  type: "divider";
}

// 链接块
export interface LinkBlock extends Block {
  type: "link";
  content: string; // 链接标题或描述
  metadata: {
    url: string; // 链接URL
    description?: string; // 链接描述
    imageUrl?: string; // 预览图片URL
    siteName?: string; // 网站名称
    favicon?: string; // 网站图标
    title?: string; // 链接标题
  };
}

// 表格块
export interface TableBlock extends Block {
  type: "table";
  content: string; // 可以是表格标题或简短描述
  metadata: {
    rows: Array<{
      cells: string[]; // 每行包含多个单元格内容
    }>;
    headers?: string[]; // 可选的表头
    caption?: string; // 表格标题
  };
}

// 类型保护函数
export const isTextBlock = (block: Block): block is TextBlock =>
  block.type === "text";
export const isHeadingBlock = (block: Block): block is HeadingBlock =>
  block.type === "heading";
export const isImageBlock = (block: Block): block is ImageBlock =>
  block.type === "image";
export const isQuoteBlock = (block: Block): block is QuoteBlock =>
  block.type === "quote";
export const isCodeBlock = (block: Block): block is CodeBlock =>
  block.type === "code";
export const isDividerBlock = (block: Block): block is DividerBlock =>
  block.type === "divider";
export const isLinkBlock = (block: Block): block is LinkBlock =>
  block.type === "link";
export const isTableBlock = (block: Block): block is TableBlock =>
  block.type === "table";

// 内容块类型 - 用于定义可在文章内容中显示的块类型
export type ContentBlockType = BlockType; // 包含所有块类型

// 内容块接口 - 表示可以在内容中显示的块
export interface ContentBlock extends Block {
  type: ContentBlockType;
}

// 内容块类型保护
export const isContentBlock = (block: Block): block is ContentBlock => {
  const contentBlockTypes: ContentBlockType[] = [
    "text",
    "heading",
    "image",
    "quote",
    "code",
    "link",
    "table",
    "divider", // 添加分隔线类型
  ];
  return contentBlockTypes.includes(block.type as ContentBlockType);
};

// 获取内容块的辅助函数
export function getContentBlocks(blocks: Block[]): ContentBlock[] {
  return blocks.filter(isContentBlock);
}
