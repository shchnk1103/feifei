import { Card } from "@/components/ui/Card";
import { Article } from "@/types/blog"; // 修改导入路径
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
        author: article.author.name, // 修改：使用作者名称
        authorAvatar: article.author.avatar, // 新增：作者头像
        date: formatDate(article.createdAt),
        tags: article.tags,
      }}
      className={styles.card}
    />
  );
}
