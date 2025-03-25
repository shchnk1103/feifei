import { Card } from "@/shared/components/ui/Card";
import { Article } from "@/modules/blog/types/blog";
import { formatDate } from "@/shared/utils/date";
import styles from "./styles.module.css";

interface ArticleCardProps {
  article: Article;
}

/**
 * 文章卡片组件
 * 用于在列表中显示文章摘要信息
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card
      href={`/blog/${article.id}`}
      image={{
        src: article.imageSrc,
        alt: article.title,
      }}
      title={article.title}
      description={article.description}
      meta={{
        author: article.author.name,
        authorAvatar: article.author.avatar,
        date: formatDate(article.createdAt),
        tags: article.tags,
      }}
      className={styles.card}
    />
  );
}
