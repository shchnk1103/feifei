"use client";

import { memo } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import styles from "./styles.module.css";
import sharedStyles from "../shared/styles.module.css";
import { HeadingBlock as HeadingBlockType } from "@/types/blocks";

interface HeadingBlockProps {
  block: HeadingBlockType;
  className?: string;
  onAnchorClick?: (id: string) => void;
}

export const HeadingBlock = memo(function HeadingBlock({
  block,
  className,
  onAnchorClick,
}: HeadingBlockProps) {
  const { level = 2, content } = block;
  const validLevel = Math.max(1, Math.min(6, level));

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={clsx(
        sharedStyles.blockBase,
        styles.heading,
        styles[`h${validLevel}`],
        inView && styles.visible,
        className
      )}
    >
      {content}
    </div>
  );
});
