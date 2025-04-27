import {
  Article,
  DEFAULT_ARTICLE,
  ArticleContent,
} from "@/modules/blog/types/blog";

// 类型守卫，判断 content 是否为 ArticleContent 结构
function isArticleContent(content: unknown): content is ArticleContent {
  return (
    typeof content === "object" &&
    content !== null &&
    Array.isArray((content as ArticleContent).blocks)
  );
}

type RawArticle = Partial<Article> & {
  content?: unknown;
  articleContent?: unknown;
};

export function normalizeArticle(raw: unknown): Article {
  if (typeof raw !== "object" || raw === null) {
    return {
      ...DEFAULT_ARTICLE,
      id: "",
      title: "",
    };
  }

  const rawArticle = raw as RawArticle;

  // 如果已经有 articleContent，直接返回
  if (
    rawArticle.articleContent &&
    isArticleContent(rawArticle.articleContent)
  ) {
    return {
      ...DEFAULT_ARTICLE,
      ...rawArticle,
      id: typeof rawArticle.id === "string" ? rawArticle.id : "",
      articleContent: {
        ...DEFAULT_ARTICLE.articleContent,
        ...rawArticle.articleContent,
        blocks: Array.isArray(rawArticle.articleContent.blocks)
          ? rawArticle.articleContent.blocks
          : [],
      },
    };
  }

  // 如果只有 content 字段，做兼容转换
  if (rawArticle.content && isArticleContent(rawArticle.content)) {
    return {
      ...DEFAULT_ARTICLE,
      ...rawArticle,
      id: typeof rawArticle.id === "string" ? rawArticle.id : "",
      articleContent: {
        ...DEFAULT_ARTICLE.articleContent,
        blocks: rawArticle.content.blocks,
      },
    };
  }

  // 兜底：返回默认文章
  return {
    ...DEFAULT_ARTICLE,
    id: typeof rawArticle.id === "string" ? rawArticle.id : "",
    title: typeof rawArticle.title === "string" ? rawArticle.title : "",
  };
}
