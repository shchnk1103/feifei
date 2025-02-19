"use client";

import { memo, useMemo, ComponentType } from "react";
import { Block, ContentBlockType } from "@/types/blocks";
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { LinkBlock } from "@/components/blocks/LinkBlock";
import { QuoteBlock } from "@/components/blocks/QuoteBlock";
import { useInView } from "react-intersection-observer";
import styles from "./styles.module.css";
import clsx from "clsx";

// 为未实现的组件创建占位组件
const CodeBlockPlaceholder = memo(function CodeBlockPlaceholder() {
  return null;
});

const TableBlockPlaceholder = memo(function TableBlockPlaceholder() {
  return null;
});

const DividerBlockPlaceholder = memo(function DividerBlockPlaceholder() {
  return null;
});

interface ArticleContentProps {
  blocks: Block[];
  className?: string;
}

const createBlockComponent = (
  Component: ComponentType<any>,
  type: ContentBlockType
) => {
  const BlockComponent = memo(function BlockComponent(props: { block: Block }) {
    return <Component {...props} indent />;
  });
  BlockComponent.displayName = `Block_${type}`;
  return BlockComponent;
};

export const ArticleContent = memo(function ArticleContent({
  blocks,
  className,
}: ArticleContentProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const blockComponents = useMemo(
    () => ({
      heading: createBlockComponent(HeadingBlock, "heading"),
      text: createBlockComponent(TextBlock, "text"),
      image: createBlockComponent(ImageBlock, "image"),
      link: createBlockComponent(LinkBlock, "link"),
      quote: createBlockComponent(QuoteBlock, "quote"),
      code: createBlockComponent(CodeBlockPlaceholder, "code"),
      table: createBlockComponent(TableBlockPlaceholder, "table"),
      divider: createBlockComponent(DividerBlockPlaceholder, "divider"),
    }),
    []
  );

  const renderBlock = useMemo(
    () => (block: Block) => {
      const Component = blockComponents[block.type];
      return (
        <div
          key={block.id}
          className={clsx(styles.blockWrapper, styles[`block-${block.type}`])}
        >
          <Component block={block} />
        </div>
      );
    },
    [blockComponents]
  );

  return (
    <div
      ref={ref}
      className={clsx(styles.content, inView && styles.visible, className)}
    >
      {blocks.map(renderBlock)}
    </div>
  );
});
