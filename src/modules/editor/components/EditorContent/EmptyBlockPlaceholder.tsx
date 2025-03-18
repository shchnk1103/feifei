import React, { memo, useState } from "react";
import { BlockType } from "@/modules/editor/types/blocks";
import { AddBlockButton } from "../BlockEditor/blocks/AddBlockButton";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { animations } from "./animations";

/**
 * 空白块占位符组件的Props接口
 */
export interface EmptyBlockPlaceholderProps {
  /** 添加新块的回调函数 */
  onAddBlock: (type: BlockType) => void;
  /** 组件是否可见 */
  isVisible: boolean;
}

/**
 * 空白块占位符组件
 * 在内容块列表底部显示一个占位符，提示用户可以继续添加内容
 */
export const EmptyBlockPlaceholder = memo(
  ({ onAddBlock, isVisible }: EmptyBlockPlaceholderProps) => {
    // 跟踪鼠标悬停状态
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className={styles.emptyBlockPlaceholder}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={animations.emptyPlaceholder.initial}
        animate={animations.emptyPlaceholder.animate(isVisible, isHovered)}
        transition={animations.emptyPlaceholder.transition}
      >
        {/* 提示文本 */}
        <div className={styles.emptyBlockHint}>
          {isHovered ? "添加内容块" : "+ 继续编辑"}
        </div>

        {/* 悬停时显示添加按钮 */}
        {isHovered && (
          <motion.div
            className={styles.emptyBlockButtons}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AddBlockButton onAddBlock={onAddBlock} />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

// 添加组件名称，便于调试
EmptyBlockPlaceholder.displayName = "EmptyBlockPlaceholder";
