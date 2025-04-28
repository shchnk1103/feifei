/**
 * 空状态组件
 *
 * 用于显示没有数据时的提示信息，包含：
 * - 主要提示信息
 * - 可选的建议信息
 *
 * @param message - 主要提示信息
 * @param suggestion - 可选的建议信息
 */
import styles from "./styles.module.css";

interface EmptyStateProps {
  message: string;
  suggestion?: string;
}

export function EmptyState({ message, suggestion }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p>{message}</p>
      {suggestion && <p className={styles.suggestion}>{suggestion}</p>}
    </div>
  );
}
