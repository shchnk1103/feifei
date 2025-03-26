"use client";

import { memo, useState } from "react";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import { LinkBlock as LinkBlockType } from "@/modules/editor/types/blocks";
import styles from "./styles.module.css";
import clsx from "clsx";

interface LinkBlockProps {
  block: LinkBlockType;
  className?: string;
}

export const LinkBlock = memo(function LinkBlock({
  block,
  className,
}: LinkBlockProps) {
  const [imageError, setImageError] = useState(false);
  const { metadata, content } = block;

  if (!metadata?.url) return null;

  return (
    <a
      href={metadata.url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.link, className)}
      aria-label={`访问链接：${content}`}
    >
      <div className={styles.linkCard}>
        {metadata.imageUrl && !imageError && (
          <div className={styles.imageWrapper}>
            <OptimizedImage
              src={metadata.imageUrl}
              alt={content}
              width={120}
              height={120}
              className={styles.image}
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{content}</h3>
          {metadata.description && (
            <p className={styles.description}>{metadata.description}</p>
          )}
          <span className={styles.url}>{metadata.url}</span>
        </div>
      </div>
    </a>
  );
});
