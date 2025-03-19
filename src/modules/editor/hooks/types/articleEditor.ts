import { Block } from "@/modules/editor/types/blocks";
import { Article } from "@/modules/blog/types/blog";

// 用于更新文章的类型
export type UpdateableArticle = Partial<Omit<Article, "id">> & {
  id: string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  createdAt?: Date | string;
};

// 文章内容类型，用于跟踪变化
export type ArticleContent = {
  title: string;
  blocks: Block[];
  imageSrc: string;
  tags: string[];
};

// 保存状态类型
export type SaveStatus = "saved" | "saving" | "error";

// 调试信息类型
export type DebugInfo = {
  lastLocalSaveTime: string;
  lastDbSaveTime: string;
  hasPendingDbChanges: boolean;
  contentChanged: boolean;
  saveCount: {
    local: number;
    db: number;
  };
};

// Hook返回的状态和函数
export type ArticleEditorReturn = {
  // 文章数据
  article: Article;
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];

  // UI状态
  loading: boolean;
  error: string | null;
  saveStatus: SaveStatus;
  sidebarOpen: boolean;

  // 调试信息
  debugInfo: DebugInfo;

  // 事件处理函数
  handleTitleChange: (newTitle: string) => void;
  handleBlocksChange: (newBlocks: Block[]) => void;
  handleCoverImageChange: (imageUrl: string) => void;
  handleTagsChange: (newTags: string[]) => void;
  publishArticle: () => Promise<void>;
  toggleSidebar: (isOpen?: boolean) => void;

  // 辅助函数
  hasContentChanged: () => boolean;
};
