import { useEffect } from "react";
import { BlockType } from "@/modules/editor/types/blocks";
import styles from "./styles.module.css";

/**
 * 键盘快捷键钩子的Props接口
 */
interface UseKeyboardShortcutsProps {
  /** 添加新块的回调函数 */
  addNewBlock: (type: BlockType, position?: number) => void;
  /** 块的数组长度 */
  blocksLength: number;
}

/**
 * 键盘快捷键钩子
 * 添加全局键盘快捷键支持
 */
export const useKeyboardShortcuts = ({
  addNewBlock,
  blocksLength,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下Cmd/Ctrl + / 快捷键
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();

        // 获取当前焦点所在的块索引
        const activeElement = document.activeElement;
        const blockContainer = activeElement?.closest("[data-block-index]");
        const blockIndex = blockContainer
          ? parseInt(blockContainer.getAttribute("data-block-index") || "0", 10)
          : blocksLength;

        // 在当前位置后添加一个新的文本块
        addNewBlock("text", blockIndex + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [blocksLength, addNewBlock]);
};

/**
 * 快捷键提示组件
 * 显示可用的键盘快捷键提示
 */
export const KeyboardShortcutHint: React.FC = () => {
  return (
    <div className={styles.keyboardShortcutHint}>
      提示: 按下 <kbd>Ctrl</kbd>+<kbd>/</kbd> 在当前位置添加新块
    </div>
  );
};
