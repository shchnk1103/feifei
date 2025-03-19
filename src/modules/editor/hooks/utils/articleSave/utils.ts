import { Article } from "@/modules/blog/types/blog";
import { Block } from "@/modules/editor/types/blocks";
import { ArticleContent, UpdateableArticle } from "../../types/articleEditor";

/**
 * 检查内容是否真的有变化
 */
export function hasContentChanged(
  titleRef: React.MutableRefObject<string>,
  blocksRef: React.MutableRefObject<Block[]>,
  coverImageRef: React.MutableRefObject<string>,
  tagsRef: React.MutableRefObject<string[]>,
  initialLoadedDataRef: React.MutableRefObject<ArticleContent | null>
): boolean {
  if (!initialLoadedDataRef.current) return false;

  return (
    titleRef.current !== initialLoadedDataRef.current.title ||
    JSON.stringify(blocksRef.current) !==
      JSON.stringify(initialLoadedDataRef.current.blocks) ||
    coverImageRef.current !== initialLoadedDataRef.current.imageSrc ||
    JSON.stringify(tagsRef.current) !==
      JSON.stringify(initialLoadedDataRef.current.tags)
  );
}

/**
 * 创建要保存的文章对象
 */
export function createArticleToSave(
  initialArticleId: string,
  title: string,
  coverImage: string,
  blocks: Block[],
  tags: string[],
  article: Article | null
): UpdateableArticle {
  return {
    id: initialArticleId,
    title,
    imageSrc: coverImage,
    articleContent: {
      blocks,
      version: article?.articleContent?.version || 1,
    },
    tags,
    updatedAt: new Date(),
  };
}
