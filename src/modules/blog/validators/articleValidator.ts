import { Article } from "../types/blog";
import { ArticleError } from "../errors/ArticleError";

export class ArticleValidator {
  /**
   * 验证文章数据
   */
  validate(article: Partial<Article>): void {
    this.validateTitle(article);
    this.validatePublishedArticle(article);
  }

  private validateTitle(article: Partial<Article>): void {
    if (!article.title?.trim()) {
      throw new ArticleError("文章标题不能为空", "VALIDATION_ERROR");
    }
  }

  private validatePublishedArticle(article: Partial<Article>): void {
    if (article.status === "published") {
      if (!article.articleContent?.blocks?.length) {
        throw new ArticleError("发布的文章必须包含内容", "VALIDATION_ERROR");
      }
      if (!article.description?.trim()) {
        throw new ArticleError("发布的文章必须包含描述", "VALIDATION_ERROR");
      }
    }
  }
}
