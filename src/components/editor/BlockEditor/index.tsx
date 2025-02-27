"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block, BlockType } from "@/types/blocks";
import { BlockControls } from "./blocks/BlockControls";
import { TextBlockEditor } from "./blocks/TextBlockEditor";
import { HeadingBlockEditor } from "./blocks/HeadingBlockEditor";
import { CoverImageEditor } from "./blocks/CoverImageEditor";
import { AddBlockButton } from "./blocks/AddBlockButton";
import styles from "./styles.module.css";

interface BlockEditorProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  coverImage: string;
  onCoverImageChange: (imageUrl: string) => void;
}

export function BlockEditor({
  blocks,
  onBlocksChange,
  coverImage,
  onCoverImageChange,
}: BlockEditorProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // 添加新块
  const addBlock = (type: BlockType, index: number) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      content: "",
    };

    // 添加特定类型块的默认属性
    if (type === "heading") {
      (newBlock as any).level = 2;
    } else if (type === "image") {
      (newBlock as any).metadata = {
        imageUrl: "",
        alt: "",
        description: "",
      };
    }

    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    onBlocksChange(newBlocks);
    setActiveBlockId(newBlock.id);
  };

  // 添加块在指定位置后
  const addBlockAfter = (blockId: string, type: BlockType) => {
    const index = blocks.findIndex((block) => block.id === blockId);
    if (index !== -1) {
      addBlock(type, index + 1);
    }
  };

  // 更新块内容
  const updateBlock = (id: string, data: Partial<Block>) => {
    const newBlocks = blocks.map((block) => {
      if (block.id === id) {
        return { ...block, ...data };
      }
      return block;
    });
    onBlocksChange(newBlocks);
  };

  // 删除块
  const deleteBlock = (id: string) => {
    // 防止删除所有块
    if (blocks.length <= 1) {
      // 如果只剩一个块，清空它的内容而不是删除
      updateBlock(id, { content: "" });
      return;
    }

    const newBlocks = blocks.filter((block) => block.id !== id);
    onBlocksChange(newBlocks);
    setActiveBlockId(null);
  };

  // 移动块
  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;

    const newIndex =
      direction === "up"
        ? Math.max(0, index - 1)
        : Math.min(blocks.length - 1, index + 1);
    if (newIndex === index) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, movedBlock);
    onBlocksChange(newBlocks);
  };

  // 复制块
  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === id);
    if (!blockToDuplicate) return;

    const duplicatedBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const index = blocks.findIndex((block) => block.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    onBlocksChange(newBlocks);
  };

  // 处理按下回车键
  const handleEnterKey = (blockId: string) => {
    const index = blocks.findIndex((block) => block.id === blockId);
    if (index !== -1) {
      addBlock("text", index + 1);
    }
  };

  // 渲染块编辑器
  const renderBlockEditor = (block: Block, index: number) => {
    const isActive = activeBlockId === block.id;

    const commonProps = {
      block,
      isActive,
      onFocus: () => setActiveBlockId(block.id),
      onBlur: () => {}, // 不立即清除activeBlockId，以便显示控件
      onChange: (data: Partial<Block>) => updateBlock(block.id, data),
      onEnterKey: () => handleEnterKey(block.id),
    };

    return (
      <motion.div
        key={block.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${styles.blockWrapper} ${
          isActive ? styles.activeBlock : ""
        }`}
        layout
      >
        {isActive && (
          <BlockControls
            blockType={block.type}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, "up")}
            onMoveDown={() => moveBlock(block.id, "down")}
            onDuplicate={() => duplicateBlock(block.id)}
          />
        )}

        {block.type === "text" && <TextBlockEditor {...commonProps} />}
        {block.type === "heading" && <HeadingBlockEditor {...commonProps} />}
        {/* 此处可以添加其他类型块的编辑器 */}

        {isActive && blocks.length - 1 === index && (
          <div className={styles.addBlockButtonContainer}>
            <AddBlockButton onAddBlock={(type) => addBlock(type, index + 1)} />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={styles.blockEditorContainer}>
      <CoverImageEditor imageUrl={coverImage} onChange={onCoverImageChange} />

      <div className={styles.blocksContainer}>
        {blocks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>开始创建你的文章</p>
            <AddBlockButton onAddBlock={(type) => addBlock(type, 0)} large />
          </div>
        ) : (
          blocks.map((block, index) => renderBlockEditor(block, index))
        )}
      </div>

      {blocks.length > 0 && activeBlockId === null && (
        <div className={styles.addBlockButtonContainer}>
          <AddBlockButton
            onAddBlock={(type) => addBlock(type, blocks.length)}
          />
        </div>
      )}
    </div>
  );
}
