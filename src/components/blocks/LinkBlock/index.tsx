import Image from "next/image";
import { LinkBlock as LinkBlockType } from "@/types/blocks";
import styles from "./styles.module.css";

interface LinkBlockProps {
  block: LinkBlockType;
}

export function LinkBlock({ block }: LinkBlockProps) {
  return (
    <a
      href={block.metadata?.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <div className={styles.linkCard}>
        {block.metadata?.imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={block.metadata.imageUrl}
              alt={block.content}
              width={120}
              height={120}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{block.content}</h3>
          {block.metadata?.description && (
            <p className={styles.description}>{block.metadata.description}</p>
          )}
          <span className={styles.url}>{block.metadata?.url}</span>
        </div>
      </div>
    </a>
  );
}
