"use client";

import { createElement, memo } from "react";
import { HeadingBlock as HeadingBlockType } from "@/types/blocks";
import styles from "./styles.module.css";
import sharedStyles from "../shared/styles.module.css";
import clsx from "clsx";

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

  // 验证并限制标题级别在 1-6 之间
  const validLevel = Math.max(1, Math.min(6, level));

  // 生成锚点ID
  const headingId = `heading-${block.id}`;

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onAnchorClick?.(headingId);

    // 如果没有提供点击处理函数，执行默认的锚点跳转
    if (!onAnchorClick) {
      window.location.hash = headingId;
    }
  };

  return createElement(
    `h${validLevel}`,
    {
      className: clsx(
        styles[`heading${validLevel}`],
        styles.headingBase,
        sharedStyles.blockBase,
        className
      ),
      id: headingId,
      "data-level": validLevel,
      role: "heading",
      "aria-level": validLevel,
    },
    <>
      {content}
      <a
        href={`#${headingId}`}
        className={styles.anchor}
        onClick={handleAnchorClick}
        aria-label={`${content} 的链接`}
      >
        #
      </a>
    </>
  );
});
