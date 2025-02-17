import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import Image from "next/image";
import { formatDate } from "@/utils/date";
import styles from "./page.module.css";
import { ContentBlock } from "@/types/blog";
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { LinkBlock } from "@/components/blocks/LinkBlock";
import { MusicBlock } from "@/components/blocks/MusicBlock";
import { QuoteBlock } from "@/components/blocks/QuoteBlock";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Remove await as params.id is already available
  const article = articles.find(
    (article) => article.id.toString() === params.id
  );

  if (!article) {
    notFound();
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock key={block.id} block={block} />;
      case "text":
        return <TextBlock key={block.id} block={block} />;
      case "image":
        return <ImageBlock key={block.id} block={block} />;
      case "link":
        return <LinkBlock key={block.id} block={block} />;
      case "music":
        return <MusicBlock key={block.id} block={block} />;
      case "quote":
        return <QuoteBlock key={block.id} block={block} />;
      default:
        return null;
    }
  };

  return (
    <article className={styles.article}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.info}>
            <span className={styles.author}>{article.author}</span>
            <time dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
          </div>
          <div className={styles.tags}>
            {article.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cover}>
        <Image
          src={article.imageSrc}
          alt={article.title}
          width={1920}
          height={1080}
          priority
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        {article.articleContent.blocks.map((block) => renderBlock(block))}
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}
