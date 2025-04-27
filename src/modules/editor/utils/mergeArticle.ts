import { Article } from "@/modules/blog/types/blog";

/**
 * 合并远端和本地的 Article 数据，优先本地 blocks，合并元数据
 */
export function mergeArticle(remote: Article, local: Article): Article {
  return {
    ...remote,
    ...local,
    articleContent: {
      ...(remote.articleContent || {}),
      ...(local.articleContent || {}),
      blocks:
        local.articleContent?.blocks || remote.articleContent?.blocks || [],
    },
    metadata: {
      ...remote.metadata,
      ...local.metadata,
    },
  };
}
