"use client";

import { memo } from "react";
import { QuoteBlock as QuoteBlockType } from "@/modules/editor/types/blocks";
import { useInView } from "react-intersection-observer";
import styles from "./styles.module.css";
import sharedStyles from "../shared/styles.module.css";
import clsx from "clsx";

interface QuoteBlockProps {
  block: QuoteBlockType;
  className?: string;
}

export const QuoteBlock = memo(function QuoteBlock({
  block,
  className,
}: QuoteBlockProps) {
  const { content, metadata } = block;
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <blockquote
      ref={ref}
      className={clsx(
        styles.quote,
        sharedStyles.blockBase,
        inView && styles.visible,
        className
      )}
      role="figure"
      aria-label={`引用内容：${content}`}
    >
      <p className={styles.content}>{content}</p>
      {(metadata?.author || metadata?.source) && (
        <footer className={styles.footer}>
          {metadata.author && (
            <cite className={styles.author}>{metadata.author}</cite>
          )}
          {metadata.source && (
            <span className={styles.source}>《{metadata.source}》</span>
          )}
        </footer>
      )}
    </blockquote>
  );
});
