import { useState, useCallback, useRef, useEffect } from "react";
import { Block } from "@/modules/editor/types/blocks";
import { Article } from "@/modules/blog/types/blog";
import { ArticleContent } from "../types/articleEditor";

type ArticleStateReturn = {
  // 状态
  title: string;
  blocks: Block[];
  coverImage: string;
  tags: string[];
  sidebarOpen: boolean;
  initialLoadedData: ArticleContent | null;

  // 处理函数
  setTitle: (title: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setCoverImage: (image: string) => void;
  setTags: (tags: string[]) => void;
  setInitialLoadedData: (data: ArticleContent) => void;

  // 事件处理函数
  handleTitleChange: (newTitle: string) => void;
  handleBlocksChange: (newBlocks: Block[]) => void;
  handleCoverImageChange: (newImage: string) => void;
  handleTagsChange: (newTags: string[]) => void;
  toggleSidebar: (isOpen?: boolean) => void;

  // 判断是否有变化
  hasContentChanged: () => boolean;
};

/**
 * 管理文章的基本状态更新
 */
export function useArticleState(initialArticle: Article): ArticleStateReturn {
  // 编辑内容状态
  const [title, setTitle] = useState<string>(
    initialArticle.title || "未命名文章"
  );
  const [blocks, setBlocks] = useState<Block[]>(
    initialArticle.articleContent?.blocks || []
  );
  const [coverImage, setCoverImage] = useState<string>(
    initialArticle.imageSrc || ""
  );
  const [tags, setTags] = useState<string[]>(initialArticle.tags || []);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 记录初始加载的文章数据，用于检测变化
  const [initialLoadedData, setInitialLoadedData] =
    useState<ArticleContent | null>(null);

  // 使用引用存储最新的状态值，避免不必要的重新计算
  const titleRef = useRef(title);
  const blocksRef = useRef(blocks);
  const coverImageRef = useRef(coverImage);
  const tagsRef = useRef(tags);
  const initialLoadedDataRef = useRef(initialLoadedData);

  // 更新引用，以保持最新值
  useEffect(() => {
    titleRef.current = title;
    blocksRef.current = blocks;
    coverImageRef.current = coverImage;
    tagsRef.current = tags;
    initialLoadedDataRef.current = initialLoadedData;
  }, [title, blocks, coverImage, tags, initialLoadedData]);

  /**
   * 检查文章内容是否发生变化
   * 优化：使用引用访问最新值，减少不必要的重新计算
   */
  const hasContentChanged = useCallback(() => {
    const data = initialLoadedDataRef.current;
    if (!data) return false;

    const titleChanged = titleRef.current !== data.title;

    // 只有在标题、封面或标签变化时才进行较昂贵的blocks比较
    if (
      titleChanged ||
      coverImageRef.current !== data.imageSrc ||
      JSON.stringify(tagsRef.current) !== JSON.stringify(data.tags)
    ) {
      return true;
    }

    // 只有在前面检查都未发现变化时，才进行blocks的深度比较
    return JSON.stringify(blocksRef.current) !== JSON.stringify(data.blocks);
  }, []);

  /**
   * 处理标题变更
   */
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  /**
   * 处理块内容变更
   */
  const handleBlocksChange = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
  }, []);

  /**
   * 处理封面图变更
   */
  const handleCoverImageChange = useCallback((newImage: string) => {
    setCoverImage(newImage);
  }, []);

  /**
   * 处理标签变更
   */
  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  /**
   * 切换侧边栏
   */
  const toggleSidebar = useCallback(
    (isOpen?: boolean) => {
      setSidebarOpen(isOpen !== undefined ? isOpen : !sidebarOpen);
    },
    [sidebarOpen]
  );

  return {
    // 状态
    title,
    blocks,
    coverImage,
    tags,
    sidebarOpen,
    initialLoadedData,

    // 状态更新函数
    setTitle,
    setBlocks,
    setCoverImage,
    setTags,
    setInitialLoadedData,

    // 事件处理函数
    handleTitleChange,
    handleBlocksChange,
    handleCoverImageChange,
    handleTagsChange,
    toggleSidebar,

    // 辅助函数
    hasContentChanged,
  };
}
