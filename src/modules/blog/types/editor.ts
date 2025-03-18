import { Article, ArticleVisibility } from "./blog";

export interface CreateArticleOptions {
  // 基础信息
  type: "blank" | "template" | "import";
  templateId?: string;

  // 文章基本信息
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];

  // 设置
  visibility: ArticleVisibility;
  allowComments: boolean;

  // 封面图片
  coverImage?: File;
}

export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  articleContent: Article["articleContent"];
}
