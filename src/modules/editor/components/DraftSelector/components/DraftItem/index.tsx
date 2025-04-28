/**
 * 草稿项组件
 *
 * 用于显示单个草稿的信息，包含：
 * - 草稿标题
 * - 最后修改时间
 * - 删除按钮
 * - 删除确认对话框
 *
 * @param draft - 草稿数据对象
 * @param isDeleting - 是否正在执行删除操作
 * @param onDelete - 删除草稿的回调函数
 * @param onCancelDelete - 取消删除的回调函数
 */
import { FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { Article } from "@/modules/blog/types/blog";

interface DraftItemProps {
  draft: Article;
  isDeleting: boolean;
  isConfirming: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onConfirmDelete: (e: React.MouseEvent, id: string) => void;
  onCancelDelete: (e: React.MouseEvent) => void;
}

export function DraftItem({
  draft,
  isDeleting,
  isConfirming,
  onSelect,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: DraftItemProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(draft.id);
  };

  return (
    <div className={styles.draftItem} onClick={() => onSelect(draft.id)}>
      <div className={styles.draftContent}>
        <h3 className={styles.draftTitle}>{draft.title || "未命名草稿"}</h3>

        <p className={styles.draftMeta}>
          {draft.updatedAt
            ? (() => {
                // 检查是否是 Firebase 时间戳对象
                if (
                  draft.updatedAt &&
                  typeof draft.updatedAt === "object" &&
                  "_seconds" in draft.updatedAt
                ) {
                  const timestamp = draft.updatedAt as unknown as {
                    _seconds: number;
                    _nanoseconds: number;
                  };
                  const date = new Date(timestamp._seconds * 1000);
                  return `上次编辑: ${date.toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}`;
                }
                // 如果是 Date 对象
                if (draft.updatedAt instanceof Date) {
                  return `上次编辑: ${draft.updatedAt.toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}`;
                }
                return "最近编辑";
              })()
            : "最近编辑"}
        </p>

        <p className={styles.draftDescription}>
          {draft.description || "暂无描述"}
        </p>
      </div>
      <div className={styles.draftActions}>
        {isConfirming ? (
          <DeleteConfirmation
            isDeleting={isDeleting}
            onConfirm={(e) => onConfirmDelete(e, draft.id)}
            onCancel={onCancelDelete}
          />
        ) : (
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            disabled={isDeleting}
            aria-label="删除草稿"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}
