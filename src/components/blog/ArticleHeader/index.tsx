import { formatDate } from "@/utils/date";
import Image from "next/image";
import styles from "./styles.module.css";

interface ArticleHeaderProps {
  title: string;
  author: string;
  createdAt: string;
  tags: string[];
  coverImage: string;
}

export const ArticleHeader = ({
  title,
  author,
  createdAt,
  tags,
  coverImage,
}: ArticleHeaderProps) => (
  <header className={styles.header}>
    <div className={styles.cover}>
      <Image
        src={coverImage}
        alt={title}
        width={1920}
        height={1080}
        priority
        className={styles.image}
      />
    </div>

    <div className={styles.meta}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.info}>
        <span className={styles.author}>{author}</span>
        <time dateTime={createdAt}>{formatDate(createdAt)}</time>
      </div>

      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  </header>
);
