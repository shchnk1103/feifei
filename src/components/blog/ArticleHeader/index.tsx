import { formatDate } from "@/utils/date";
import Image from "next/image";
import styles from "./styles.module.css";

interface ArticleHeaderProps {
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
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
        <div className={styles.author}>
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className={styles.avatar}
            />
          )}
          <span>{author.name}</span>
        </div>
        <time dateTime={createdAt.toISOString()}>{formatDate(createdAt)}</time>
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
