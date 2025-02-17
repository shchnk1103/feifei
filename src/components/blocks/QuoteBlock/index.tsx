import { QuoteBlock as QuoteBlockType } from "@/types/blog";
import styles from "./styles.module.css";

interface QuoteBlockProps {
  block: QuoteBlockType;
}

export function QuoteBlock({ block }: QuoteBlockProps) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.content}>{block.content}</p>
      {block.metadata && (
        <footer className={styles.footer}>
          {block.metadata.author && (
            <cite className={styles.author}>{block.metadata.author}</cite>
          )}
          {block.metadata.source && (
            <span className={styles.source}>{block.metadata.source}</span>
          )}
        </footer>
      )}
    </blockquote>
  );
}
