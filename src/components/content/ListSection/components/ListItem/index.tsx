import { Card } from "@/components/ui/Card";
import { Article } from "@/data/articles";
import { formatDate } from "@/utils/date";
import styles from "./styles.module.css";

interface ListItemProps {
  article: Article;
}

export function ListItem({ article }: ListItemProps) {
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
        author: article.author,
        date: formatDate(article.createdAt),
        tags: article.tags,
      }}
      className={styles.card}
    />
  );
}
