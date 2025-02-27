"use client";

import React, { useState, useRef, useEffect } from "react"; // 确保导入 React
import { motion, AnimatePresence } from "framer-motion";
import {
  BiPlus,
  BiParagraph,
  BiHeading,
  BiImage,
  BiNote, // 用于引用块
  BiCode,
  BiMinus,
} from "react-icons/bi";
import { BlockType } from "@/types/blocks";
import styles from "./styles.module.css";

interface AddBlockButtonProps {
  onAddBlock: (type: BlockType) => void;
  large?: boolean;
}

export function AddBlockButton({
  onAddBlock,
  large = false,
}: AddBlockButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 定义块类型配置
  const blockTypes: {
    type: BlockType;
    icon: React.ReactElement;
    label: string;
  }[] = [
    { type: "text", icon: <BiParagraph size={20} />, label: "文本" },
    { type: "heading", icon: <BiHeading size={20} />, label: "标题" },
    { type: "image", icon: <BiImage size={20} />, label: "图片" },
    { type: "quote", icon: <BiNote size={20} />, label: "引用" },
    { type: "code", icon: <BiCode size={20} />, label: "代码" },
    { type: "divider", icon: <BiMinus size={20} />, label: "分隔线" },
  ];

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${styles.addBlockButtonWrapper} ${large ? styles.large : ""}`}
      ref={menuRef}
    >
      <button
        className={`${styles.addBlockButton} ${
          isMenuOpen ? styles.active : ""
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="添加内容块"
      >
        <BiPlus className={styles.buttonIcon} />
        <span className={styles.buttonText}>添加内容</span>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.blockTypeMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {blockTypes.map((blockType) => (
              <button
                key={blockType.type}
                className={styles.blockTypeButton}
                onClick={() => {
                  onAddBlock(blockType.type);
                  setIsMenuOpen(false);
                }}
              >
                <div className={styles.blockTypeIcon}>{blockType.icon}</div>
                <span className={styles.blockTypeLabel}>{blockType.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
