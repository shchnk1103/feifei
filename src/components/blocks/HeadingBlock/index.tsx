import { createElement } from "react";
import { HeadingBlock as HeadingBlockType } from "@/types/blocks";
import styles from "./styles.module.css";

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  return createElement(
    `h${block.level || 2}`,
    {
      className: styles[`heading${block.level}`],
    },
    block.content
  );
}
