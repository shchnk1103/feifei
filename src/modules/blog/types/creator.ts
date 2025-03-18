import { Article } from "./blog";
import { CreateArticleOptions } from "./editor";

// 基础创建选项（不包含type字段）
export type BaseArticleOptions = Omit<CreateArticleOptions, "type">;

// 模板创建选项
export interface TemplateArticleOptions extends BaseArticleOptions {
  templateId: string;
}

// 导入创建选项
export interface ImportArticleOptions extends BaseArticleOptions {
  importData: unknown;
}

// 文章创建器接口
export interface ArticleCreator {
  createBlankArticle(options: BaseArticleOptions): Promise<Article>;
  createFromTemplate(options: TemplateArticleOptions): Promise<Article>;
  createFromImport(options: ImportArticleOptions): Promise<Article>;
}
