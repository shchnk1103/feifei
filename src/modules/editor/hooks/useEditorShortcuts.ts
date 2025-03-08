import { useEffect, useCallback } from "react";
import { Block } from "@/modules/editor/types/blocks";

interface ShortcutOptions {
  blocks: Block[];
  activeBlockId: string | null;
  onBlocksChange: (blocks: Block[]) => void;
  onAddBlock: (type: string, index: number) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
}

export function useEditorShortcuts({
  blocks,
  activeBlockId,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
}: ShortcutOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 只有当有活动块时才处理快捷键
      if (!activeBlockId) return;

      const activeIndex = blocks.findIndex(
        (block) => block.id === activeBlockId
      );
      if (activeIndex === -1) return;

      // 处理常见快捷键
      if (e.key === "Delete" && e.ctrlKey) {
        e.preventDefault();
        onDeleteBlock(activeBlockId);
      }

      // Ctrl+上/下箭头移动块
      if (e.ctrlKey && e.key === "ArrowUp") {
        e.preventDefault();
        onMoveBlock(activeBlockId, "up");
      }

      if (e.ctrlKey && e.key === "ArrowDown") {
        e.preventDefault();
        onMoveBlock(activeBlockId, "down");
      }

      // Ctrl+Enter 在当前块后添加新文本块
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        onAddBlock("text", activeIndex + 1);
      }

      // Ctrl+Shift+1/2/3 添加不同级别标题
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === "1") {
          e.preventDefault();
          onAddBlock("heading", activeIndex + 1);
          // 需要进一步设置标题级别为1
        } else if (e.key === "2") {
          e.preventDefault();
          onAddBlock("heading", activeIndex + 1);
          // 需要进一步设置标题级别为2
        } else if (e.key === "3") {
          e.preventDefault();
          onAddBlock("heading", activeIndex + 1);
          // 需要进一步设置标题级别为3
        }
      }
    },
    [blocks, activeBlockId, onAddBlock, onDeleteBlock, onMoveBlock]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
