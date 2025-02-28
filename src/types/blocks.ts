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

// 定义通用的元数据类型 - 所有块类型共享的基础属性
export interface BaseBlockMetadata {
  // 可以添加所有块类型共享的基础元数据
  customClass?: string;
  id?: string;
  align?: "left" | "center" | "right";
}

// 修改 BlockMetadata 以支持更广泛的值类型
export interface BlockMetadata extends BaseBlockMetadata {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, unknown>
    | Array<Record<string, unknown>> // 添加对象数组类型支持
    | null
    | undefined;
}

// 块的基础接口
export interface Block {
  id: string; // 块的唯一标识
  type: BlockType; // 块的类型
  content: string; // 文本内容
  level?: number; // 用于标题块的级别
  metadata?: BlockMetadata; // 使用通用元数据类型
}

// 特定块类型的元数据 - 都应该扩展 BaseBlockMetadata
export interface ImageBlockMetadata extends BaseBlockMetadata {
  imageUrl: string; // 图片URL
  alt?: string; // 替代文本
  caption?: string; // 图片说明
  width?: number; // 宽度
  height?: number; // 高度
  [key: string]: // 添加索引签名以兼容 BlockMetadata
  | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, unknown>
    | null
    | undefined;
}

export interface QuoteBlockMetadata extends BaseBlockMetadata {
  author?: string; // 引用作者
  source?: string; // 引用来源
  [key: string]: // 添加索引签名以兼容 BlockMetadata
  | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, unknown>
    | null
    | undefined;
}

export interface CodeBlockMetadata extends BaseBlockMetadata {
  language?: string; // 代码语言
  highlightLines?: number[]; // 高亮行
  [key: string]: // 添加索引签名以兼容 BlockMetadata
  | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, unknown>
    | null
    | undefined;
}

export interface LinkBlockMetadata extends BaseBlockMetadata {
  url: string; // 链接URL
  description?: string; // 链接描述
  imageUrl?: string; // 预览图片URL
  siteName?: string; // 网站名称
  favicon?: string; // 网站图标
  title?: string; // 链接标题
  [key: string]: // 添加索引签名以兼容 BlockMetadata
  | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, unknown>
    | null
    | undefined;
}

// 修改 TableBlockMetadata，使其与 BlockMetadata 兼容
export interface TableBlockMetadata extends BlockMetadata {
  rows: Array<{
    cells: string[]; // 每行包含多个单元格内容
  }>;
  headers?: string[]; // 可选的表头
  caption?: string; // 表格标题
  // 不需要额外的索引签名，因为已经从 BlockMetadata 继承了
}

// 文本块
export interface TextBlock extends Block {
  type: "text";
  content: string;
  metadata?: BlockMetadata;
}

// 标题块
export interface HeadingBlock extends Block {
  type: "heading";
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  metadata?: BlockMetadata;
}

// 图片块
export interface ImageBlock extends Block {
  type: "image";
  metadata: ImageBlockMetadata; // 仍然使用专用元数据类型，现在兼容 BlockMetadata
}

// 引用块
export interface QuoteBlock extends Block {
  type: "quote";
  content: string;
  metadata?: QuoteBlockMetadata; // 保持可选
}

// 代码块
export interface CodeBlock extends Block {
  type: "code";
  content: string;
  metadata?: CodeBlockMetadata; // 保持可选
}

// 分隔线块
export interface DividerBlock extends Block {
  type: "divider";
  metadata?: BlockMetadata;
}

// 链接块
export interface LinkBlock extends Block {
  type: "link";
  content: string; // 链接标题或描述
  metadata: LinkBlockMetadata;
}

// 表格块的定义保持不变
export interface TableBlock extends Block {
  type: "table";
  content: string; // 可以是表格标题或简短描述
  metadata: TableBlockMetadata;
}

// 类型保护函数 - 保持不变
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

// 内容块类型 - 保持不变
export type ContentBlockType = BlockType;

// 内容块接口 - 保持不变
export interface ContentBlock extends Block {
  type: ContentBlockType;
}

// 内容块类型保护 - 保持不变
export const isContentBlock = (block: Block): block is ContentBlock => {
  const contentBlockTypes: ContentBlockType[] = [
    "text",
    "heading",
    "image",
    "quote",
    "code",
    "link",
    "table",
    "divider",
  ];
  return contentBlockTypes.includes(block.type as ContentBlockType);
};

// 获取内容块的辅助函数 - 保持不变
export function getContentBlocks(blocks: Block[]): ContentBlock[] {
  return blocks.filter(isContentBlock);
}
