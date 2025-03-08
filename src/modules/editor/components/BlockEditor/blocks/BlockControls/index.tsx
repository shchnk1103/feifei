import { motion } from "framer-motion";
import { BiTrash, BiArrowToTop, BiArrowToBottom, BiCopy } from "react-icons/bi";
import { BlockType } from "@/modules/editor/types/blocks";
import styles from "./styles.module.css";

interface BlockControlsProps {
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate?: () => void;
  blockType: BlockType;
}

export function BlockControls({
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}: BlockControlsProps) {
  return (
    <motion.div
      className={styles.blockControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className={styles.blockControlButton}
        onClick={onMoveUp}
        title="上移"
        aria-label="上移块"
      >
        <BiArrowToTop size={16} />
      </button>

      <button
        className={styles.blockControlButton}
        onClick={onMoveDown}
        title="下移"
        aria-label="下移块"
      >
        <BiArrowToBottom size={16} />
      </button>

      {onDuplicate && (
        <button
          className={styles.blockControlButton}
          onClick={onDuplicate}
          title="复制"
          aria-label="复制块"
        >
          <BiCopy size={16} />
        </button>
      )}

      <button
        className={`${styles.blockControlButton} ${styles.deleteButton}`}
        onClick={onDelete}
        title="删除"
        aria-label="删除块"
      >
        <BiTrash size={16} />
      </button>
    </motion.div>
  );
}
