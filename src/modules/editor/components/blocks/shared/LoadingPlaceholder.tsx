import { memo } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface LoadingPlaceholderProps {
  text?: string;
  className?: string;
}

export const LoadingPlaceholder = memo(function LoadingPlaceholder({
  text = "加载中...",
  className,
}: LoadingPlaceholderProps) {
  return <div className={clsx(styles.loading, className)}>{text}</div>;
});
