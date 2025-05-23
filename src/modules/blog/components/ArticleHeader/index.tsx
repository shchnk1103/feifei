import { formatDate } from "@/shared/utils/date";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import styles from "./styles.module.css";

// 默认头像路径
const DEFAULT_AVATAR = "/images/default-avatar.png";

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
      {/* 使用OptimizedImage替代Image */}
      <OptimizedImage
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
          <OptimizedImage
            src={
              author.avatar && author.avatar.trim() !== ""
                ? author.avatar
                : DEFAULT_AVATAR
            }
            alt={author.name}
            width={40}
            height={40}
            className={styles.avatar}
          />
          <span className={styles.authorName}>{author.name}</span>
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
