"use client";

import { memo, useMemo, ComponentType, ReactElement } from "react";
import {
  Block,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  LinkBlock,
  QuoteBlock,
  CodeBlock,
  TableBlock,
  DividerBlock,
} from "@/types/blocks";
import { HeadingBlock as HeadingBlockComponent } from "@/components/blocks/HeadingBlock";
import { TextBlock as TextBlockComponent } from "@/components/blocks/TextBlock";
import { ImageBlock as ImageBlockComponent } from "@/components/blocks/ImageBlock";
import { LinkBlock as LinkBlockComponent } from "@/components/blocks/LinkBlock";
import { QuoteBlock as QuoteBlockComponent } from "@/components/blocks/QuoteBlock";
import { useInView } from "react-intersection-observer";
import styles from "./styles.module.css";
import clsx from "clsx";

// 基础属性
interface BaseProps {
  className?: string;
  indent?: boolean;
}

// 所有块组件的 Props 映射
type BlockComponentProps<T extends Block> = BaseProps & { block: T };

// 为未实现的组件创建占位组件，明确定义类型
const CodeBlockPlaceholder = memo(function CodeBlockPlaceholder(
  // 使用 eslint 注释禁用未使用参数警告
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: BlockComponentProps<CodeBlock>
): ReactElement | null {
  return null;
});

const TableBlockPlaceholder = memo(function TableBlockPlaceholder(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: BlockComponentProps<TableBlock>
): ReactElement | null {
  return null;
});

const DividerBlockPlaceholder = memo(function DividerBlockPlaceholder(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: BlockComponentProps<DividerBlock>
): ReactElement | null {
  return null;
});

// 文章内容组件的 Props
interface ArticleContentProps {
  blocks: Block[];
  version?: number;
  schema?: string;
  className?: string;
}

// 类型安全的 renderBlock 高阶函数
function createRenderFunction<T extends Block>(
  Component: ComponentType<BlockComponentProps<T>>
) {
  return (block: T) => (
    <div
      key={block.id}
      className={clsx(styles.blockWrapper, styles[`block-${block.type}`])}
    >
      <Component block={block} indent className={styles.block} />
    </div>
  );
}

// 类型断言函数 - 确保类型安全
function assertBlockType<T extends Block>(
  block: Block,
  type: T["type"]
): asserts block is T {
  if (block.type !== type) {
    throw new Error(`Expected block of type ${type}, but got ${block.type}`);
  }
}

// 处理未知块类型的辅助函数
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleUnknownBlockType(block: never): ReactElement {
  console.error(
    "检测到未处理的块类型，这可能表明有新增的块类型未在 switch 语句中处理"
  );
  return <div>未支持的块类型</div>;
}

export const ArticleContent = memo(function ArticleContent({
  blocks,
  className,
}: ArticleContentProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // 类型安全地渲染单个块
  const renderBlock = useMemo(
    () =>
      (block: Block): ReactElement => {
        // 根据块类型使用适当的组件
        switch (block.type) {
          case "heading":
            // 使用类型断言告诉 TypeScript 这是一个 HeadingBlock
            assertBlockType<HeadingBlock>(block, "heading");
            return createRenderFunction(HeadingBlockComponent)(block);

          case "text":
            assertBlockType<TextBlock>(block, "text");
            return createRenderFunction(TextBlockComponent)(block);

          case "image":
            assertBlockType<ImageBlock>(block, "image");
            return createRenderFunction(ImageBlockComponent)(block);

          case "link":
            assertBlockType<LinkBlock>(block, "link");
            return createRenderFunction(LinkBlockComponent)(block);

          case "quote":
            assertBlockType<QuoteBlock>(block, "quote");
            return createRenderFunction(QuoteBlockComponent)(block);

          case "code":
            assertBlockType<CodeBlock>(block, "code");
            return createRenderFunction(CodeBlockPlaceholder)(block);

          case "table":
            assertBlockType<TableBlock>(block, "table");
            return createRenderFunction(TableBlockPlaceholder)(block);

          case "divider":
            assertBlockType<DividerBlock>(block, "divider");
            return createRenderFunction(DividerBlockPlaceholder)(block);

          default:
            // 如果 BlockType 是完整的，这段代码永远不会执行
            // TypeScript 会在编译时捕获所有未处理的块类型
            return handleUnknownBlockType(block as never);
        }
      },
    []
  );

  return (
    <div
      ref={ref}
      className={clsx(styles.content, inView && styles.visible, className)}
    >
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  );
});

// 添加显示名称，方便调试
ArticleContent.displayName = "ArticleContent";
