"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Block } from "@/modules/editor/types/blocks";
import styles from "./styles.module.css";
import { BlockMap, hasEditorImplementation } from "./BlockMap";

/**
 * BlockEditor组件的Props接口
 */
export interface BlockEditorProps {
  /** 要渲染的块数组 */
  blocks: Block[];
  /** 当块内容变化时的回调 */
  onBlocksChange: (blocks: Block[]) => void;
  /** 可选的回车键处理函数，用于通知需要创建新块 */
  onEnterKey?: (blockId: string) => void;
}

/**
 * BlockEditor组件 - 专注于渲染不同类型的内容块
 *
 * 该组件负责:
 * 1. 渲染不同类型的块编辑器
 * 2. 管理块的焦点状态
 * 3. 处理块内容的更新
 */
export function BlockEditor({
  blocks,
  onBlocksChange,
  onEnterKey,
}: BlockEditorProps) {
  // 当前活跃块的ID
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // 更新块内容
  const updateBlock = useCallback(
    (id: string, data: Partial<Block>) => {
      const newBlocks = blocks.map((block) => {
        if (block.id === id) {
          return { ...block, ...data };
        }
        return block;
      });
      onBlocksChange(newBlocks);
    },
    [blocks, onBlocksChange]
  );

  // 处理按下回车键
  const handleEnterKey = useCallback(
    (blockId: string) => {
      if (onEnterKey) {
        onEnterKey(blockId);
      }
    },
    [onEnterKey]
  );

  // 渲染块编辑器
  const renderBlockEditor = useCallback(
    (block: Block) => {
      const isActive = activeBlockId === block.id;

      // 通用props，适用于所有块编辑器
      const commonProps = {
        block,
        isActive,
        onFocus: () => setActiveBlockId(block.id),
        onBlur: () => {}, // 不立即清除activeBlockId，以便外部组件有机会处理
        onChange: (data: Partial<Block>) => updateBlock(block.id, data),
        onEnterKey: () => handleEnterKey(block.id),
      };

      // 从BlockMap中获取对应的编辑器组件
      const EditorComponent = hasEditorImplementation(block.type)
        ? BlockMap[block.type]
        : () => (
            <div className={styles.notImplemented}>
              未实现的块类型: {block.type}
            </div>
          );

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
          <EditorComponent {...commonProps} />
        </motion.div>
      );
    },
    [activeBlockId, updateBlock, handleEnterKey]
  );

  return (
    <div className={styles.blockEditorContainer}>
      <div className={styles.blocksContainer}>
        {blocks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>开始创建你的文章</p>
          </div>
        ) : (
          blocks.map((block) => renderBlockEditor(block))
        )}
      </div>
    </div>
  );
}
