/**
 * 删除确认对话框组件
 *
 * 用于显示删除确认界面，包含：
 * - 确认提示文本
 * - 确认按钮
 * - 取消按钮
 *
 * @param isDeleting - 是否正在执行删除操作
 * @param onConfirm - 确认删除的回调函数
 * @param onCancel - 取消删除的回调函数
 */
import styles from "./styles.module.css";

interface DeleteConfirmationProps {
  isDeleting: boolean;
  onConfirm: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
}

export function DeleteConfirmation({
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <div className={styles.deleteConfirm}>
      <span>确认删除？</span>
      <button
        className={styles.confirmButton}
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? "删除中..." : "确认"}
      </button>
      <button
        className={styles.cancelButton}
        onClick={onCancel}
        disabled={isDeleting}
      >
        取消
      </button>
    </div>
  );
}
