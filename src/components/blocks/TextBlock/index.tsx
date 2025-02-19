"use client";

import { memo } from "react";
import { TextBlock as TextBlockType } from "@/types/blocks";
import { useInView } from "react-intersection-observer";
import styles from "./styles.module.css";
import sharedStyles from "../shared/styles.module.css";
import clsx from "clsx";

interface TextBlockProps {
  block: TextBlockType;
  className?: string;
  indent?: boolean;
  highlight?: boolean;
}

export const TextBlock = memo(function TextBlock({
  block,
  className,
  indent = false,
  highlight = false,
}: TextBlockProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <p
      ref={ref}
      className={clsx(
        styles.text,
        sharedStyles.blockBase,
        indent && styles.indent,
        highlight && styles.highlight,
        inView && styles.visible,
        className
      )}
      role="textbox"
      aria-label="文章段落"
    >
      {block.content}
    </p>
  );
});
