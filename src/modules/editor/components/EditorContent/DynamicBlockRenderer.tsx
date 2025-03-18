import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Block, BlockType } from "@/modules/editor/types/blocks";
import { BlockEditor } from "../BlockEditor";
import { AddBlockButton } from "../BlockEditor/blocks/AddBlockButton";
import { BlockControls } from "../BlockEditor/blocks/BlockControls";
import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { animations } from "./animations";

/**
 * 动态块渲染器组件的Props接口
 */
export interface DynamicBlockRendererProps {
  /** 当前要渲染的块 */
  block: Block;
  /** 块在数组中的索引 */
  index: number;
  /** 块的总数 */
  total: number;
  /** 当块内容变化时的回调 */
  onBlockChange: (updatedBlock: Block) => void;
  /** 当添加新块时的回调 */
  onAddBlock: (type: BlockType, index: number) => void;
  /** 移动块位置的回调 */
  onMoveBlock?: (index: number, direction: "up" | "down") => void;
  /** 删除块的回调 */
  onDeleteBlock?: (index: number) => void;
  /** 复制块的回调 */
  onDuplicateBlock?: (index: number) => void;
}

/**
 * 动态块渲染器组件
 * 负责渲染单个内容块，并提供UI交互界面
 */
export const DynamicBlockRenderer = memo(
  ({
    block,
    index,
    total,
    onBlockChange,
    onAddBlock,
    onMoveBlock,
    onDeleteBlock,
    onDuplicateBlock,
  }: DynamicBlockRendererProps) => {
    // 组件内部状态
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);

    // 过渡动画效果
    const delayedTransition = useMemo(
      () => ({
        ...animations.block.transition,
        ...animations.getDelayedTransition(index, total),
      }),
      [index, total]
    );

    // 是否显示块控制按钮
    const showControls = isFocused && onMoveBlock && onDeleteBlock;

    // 处理点击块外部时失去焦点
    useEffect(() => {
      if (!isFocused) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          blockRef.current &&
          !blockRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isFocused]);

    // 块内容变化处理
    const handleBlocksChange = useCallback(
      (updatedBlocks: Block[]) => {
        if (updatedBlocks.length > 0) {
          onBlockChange(updatedBlocks[0]);
        }
      },
      [onBlockChange]
    );

    // 回车键处理 - 创建新块
    const handleEnterKey = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_: string) => onAddBlock("text", index + 1),
      [onAddBlock, index]
    );

    // UI交互处理
    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    // 添加新块按钮回调
    const handleAddBlock = useCallback(
      (type: BlockType) => onAddBlock(type, index + 1),
      [onAddBlock, index]
    );

    return (
      <div
        ref={blockRef}
        className={`${styles.blockContainer} ${
          isFocused ? styles.focused : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        data-block-index={index}
        tabIndex={0}
      >
        {/* 块控制按钮 */}
        <AnimatePresence>
          {showControls && (
            <BlockControls
              blockType={block.type}
              onDelete={() => onDeleteBlock?.(index)}
              onMoveUp={() => index > 0 && onMoveBlock?.(index, "up")}
              onMoveDown={() =>
                index < total - 1 && onMoveBlock?.(index, "down")
              }
              onDuplicate={() => onDuplicateBlock?.(index)}
            />
          )}
        </AnimatePresence>

        {/* 块内容编辑器 */}
        <motion.div
          key={block.id}
          className={styles.blockWrapper}
          initial={animations.block.initial}
          animate={animations.block.animate}
          exit={animations.block.exit}
          transition={delayedTransition}
          layout
        >
          <BlockEditor
            blocks={[block]}
            onBlocksChange={handleBlocksChange}
            onEnterKey={handleEnterKey}
          />
        </motion.div>

        {/* 添加新块按钮 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={`${styles.blockAddButtonContainer} blockAddButtonContainer`}
              initial={animations.addButton.initial}
              animate={animations.addButton.animate}
              exit={animations.addButton.exit}
              transition={animations.addButton.transition}
            >
              <AddBlockButton onAddBlock={handleAddBlock} compact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// 添加组件名称，便于调试
DynamicBlockRenderer.displayName = "DynamicBlockRenderer";
