import React, { useCallback, useMemo } from "react";
import { Block, BlockType } from "@/modules/editor/types/blocks";
import { CoverImageEditor } from "../BlockEditor/blocks/CoverImageEditor";
import { AddBlockButton } from "../BlockEditor/blocks/AddBlockButton";
import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";

// 导入分离的组件和工具
import { BlockFactory } from "./BlockFactory";
import { animations } from "./animations";
import { DynamicBlockRenderer } from "./DynamicBlockRenderer";
import { EmptyBlockPlaceholder } from "./EmptyBlockPlaceholder";
import {
  useKeyboardShortcuts,
  KeyboardShortcutHint,
} from "./KeyboardShortcuts";

/**
 * 编辑器内容组件的Props接口
 */
export interface EditorContentProps {
  /** 内容块数组 */
  blocks: Block[];
  /** 封面图片URL */
  coverImage: string;
  /** 块内容变化时的回调 */
  onBlocksChange: (blocks: Block[]) => void;
  /** 封面图片变化时的回调 */
  onCoverImageChange: (imageUrl: string) => void;
}

/**
 * 编辑器内容组件
 * 负责管理和渲染编辑器的整体内容，包括封面图片和内容块
 */
export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  coverImage,
  onBlocksChange,
  onCoverImageChange,
}) => {
  const blocksLength = useMemo(() => blocks.length, [blocks]);
  const hasBlocks = blocksLength > 0;

  /**
   * 块操作函数
   */
  // 添加新块
  const addNewBlock = useCallback(
    (type: BlockType = "text", position?: number) => {
      const newBlock = BlockFactory.createBlock(type);

      if (typeof position === "number") {
        const newBlocks = [...blocks];
        newBlocks.splice(position, 0, newBlock);
        onBlocksChange(newBlocks);
      } else {
        onBlocksChange([...blocks, newBlock]);
      }
    },
    [blocks, onBlocksChange]
  );

  // 处理块内容变化
  const handleBlockChange = useCallback(
    (index: number, updatedBlock: Block) => {
      const newBlocks = [...blocks];
      newBlocks[index] = updatedBlock;
      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  // 移动块位置
  const moveBlock = useCallback(
    (index: number, direction: "up" | "down") => {
      // 检查边界条件
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === blocks.length - 1)
      ) {
        return;
      }

      const newBlocks = [...blocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // 交换位置
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];

      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  // 删除块
  const deleteBlock = useCallback(
    (index: number) => {
      // 防止删除所有块 - 保留至少一个空块
      if (blocks.length <= 1) {
        const newBlocks = [...blocks];
        newBlocks[0] = {
          ...newBlocks[0],
          content: "",
        };
        onBlocksChange(newBlocks);
        return;
      }

      onBlocksChange(blocks.filter((_, i) => i !== index));
    },
    [blocks, onBlocksChange]
  );

  // 复制块
  const duplicateBlock = useCallback(
    (index: number) => {
      const blockToDuplicate = blocks[index];
      if (!blockToDuplicate) return;

      // 创建块的深拷贝并分配新ID
      const duplicatedBlock = {
        ...JSON.parse(JSON.stringify(blockToDuplicate)),
        id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };

      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, duplicatedBlock);
      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  // 使用键盘快捷键
  useKeyboardShortcuts({
    addNewBlock,
    blocksLength,
  });

  return (
    <div className={styles.content}>
      {/* 封面图片区域 */}
      <motion.div
        className={styles.coverImageContainer}
        initial={animations.coverImage.initial}
        animate={animations.coverImage.animate}
        transition={animations.coverImage.transition}
      >
        <CoverImageEditor imageUrl={coverImage} onChange={onCoverImageChange} />
      </motion.div>

      {/* 内容块区域 */}
      <AnimatePresence>
        <div className={styles.blocksContainer}>
          {/* 渲染内容块列表 */}
          {blocks.map((block, index) => (
            <DynamicBlockRenderer
              key={block.id}
              block={block}
              index={index}
              total={blocksLength}
              onBlockChange={(updatedBlock) =>
                handleBlockChange(index, updatedBlock)
              }
              onAddBlock={addNewBlock}
              onMoveBlock={moveBlock}
              onDeleteBlock={deleteBlock}
              onDuplicateBlock={duplicateBlock}
            />
          ))}

          {/* 底部空白块占位符 */}
          <EmptyBlockPlaceholder
            onAddBlock={addNewBlock}
            isVisible={hasBlocks}
          />
        </div>
      </AnimatePresence>

      {/* 底部添加内容块按钮 - 仅当没有块时显示 */}
      {!hasBlocks && (
        <div className={styles.addBlockButtonWrapper}>
          <AddBlockButton onAddBlock={addNewBlock} large />
        </div>
      )}

      {/* 键盘快捷键提示 */}
      <KeyboardShortcutHint />
    </div>
  );
};
