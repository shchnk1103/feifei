export class ArticleError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ArticleError";
  }
}
