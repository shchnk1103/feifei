import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import styles from "./styles.module.css";

interface CardMetaProps {
  author: string;
  authorAvatar?: string; // 新增：支持作者头像
  date: string;
  tags: string[];
}

interface CardProps {
  href: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  meta: CardMetaProps;
  className?: string;
}

export function Card({
  href,
  image,
  title,
  description,
  meta,
  className,
}: CardProps) {
  return (
    <Link href={href} className={cn(styles.card, className)}>
      <div className={styles.imageWrapper}>
        <Image src={image.src} alt={image.alt} fill className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <div className={styles.info}>
            <span className={styles.author}>{meta.author}</span>
            <time className={styles.datetime}>{meta.date}</time>
          </div>
          {meta.tags && (
            <div className={styles.tags}>
              {meta.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
