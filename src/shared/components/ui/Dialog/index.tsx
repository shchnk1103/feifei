"use client";

import { cn } from "@/shared/utils/cn";
import styles from "./styles.module.css";
import { forwardRef } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      children,
      className,
      title,
      description,
      closeOnClickOutside = true,
      showCloseButton = true,
    },
    ref
  ) => {
    // 对话框未打开时不渲染任何内容
    if (!open) {
      return null;
    }

    // 在客户端渲染时确保document可用
    if (typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div
        className="dialog-portal"
        style={{
          isolation: "isolate",
          position: "fixed",
          inset: 0,
          zIndex: 9999999,
        }}
      >
        {/* 遮罩层 */}
        <div
          className={styles.overlay}
          onClick={() => closeOnClickOutside && onClose()}
        />

        {/* 对话框内容 */}
        <div
          className={cn(styles.content, className)}
          ref={ref}
          onClick={(e) => e.stopPropagation()}
        >
          {title && <div className={styles.title}>{title}</div>}

          {description && (
            <div className={styles.description}>{description}</div>
          )}

          <div className={styles.dialogContent}>{children}</div>

          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="关闭"
            >
              <span aria-hidden>×</span>
            </button>
          )}
        </div>
      </div>,
      document.body
    );
  }
);

Dialog.displayName = "Dialog";
