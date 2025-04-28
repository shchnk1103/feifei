import {
  BaseArticleOptions,
  ImportArticleOptions,
} from "@/modules/blog/types/creator";
import { DefaultArticleCreator } from "@/modules/blog/services/articleCreator";

/**
 * 文章创建服务类
 * 封装了所有文章创建相关的业务逻辑，包括：
 * - 创建空白文章
 * - 基于模板创建文章
 * - 导入外部文章
 */
export class ArticleCreationService {
  private articleCreator: DefaultArticleCreator;

  constructor() {
    this.articleCreator = new DefaultArticleCreator();
  }

  /**
   * 创建空白文章
   * @param options 文章创建选项，包含标题、描述、分类等基本信息
   * @returns 创建的文章对象
   */
  async createBlankArticle(options: BaseArticleOptions) {
    return this.articleCreator.createBlankArticle(options);
  }

  /**
   * 基于模板创建文章
   * @param options 文章创建选项，包含模板ID和基本文章信息
   * @returns 创建的文章对象
   */
  async createFromTemplate(
    options: BaseArticleOptions & { templateId: string }
  ) {
    return this.articleCreator.createFromTemplate(options);
  }

  /**
   * 导入外部文章
   * @param options 导入选项，包含导入源和内容
   * @returns 创建的文章对象
   */
  async createFromImport(options: ImportArticleOptions) {
    return this.articleCreator.createFromImport(options);
  }
}
