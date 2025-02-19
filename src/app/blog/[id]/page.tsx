import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import styles from "./page.module.css";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleContent } from "@/components/blog/ArticleContent";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPostPage({
  params,
  searchParams,
}: BlogPostPageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const { id } = resolvedParams;

  const article = articles.find((article) => article.id.toString() === id);
  if (!article) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <ArticleHeader
        title={article.title}
        author={article.author}
        createdAt={article.createdAt}
        tags={article.tags}
        coverImage={article.imageSrc}
      />

      <ArticleContent blocks={article.articleContent.blocks} />
    </article>
  );
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}
