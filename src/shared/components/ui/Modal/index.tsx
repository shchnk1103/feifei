"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInOut, scaleInOut } from "@/shared/utils/animations";
import styles from "./styles.module.css";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  size?: "small" | "medium" | "large";
  closeOnOverlayClick?: boolean;
}

export function Modal({
  children,
  isOpen,
  onClose,
  title,
  size = "medium",
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            onClick={closeOnOverlayClick ? onClose : undefined}
            {...fadeInOut}
          />
          <div className={styles.container}>
            <motion.div
              className={`${styles.modal} ${styles[size]}`}
              {...scaleInOut}
            >
              {title && (
                <div className={styles.header}>
                  <h2 className={styles.title}>{title}</h2>
                  <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className={styles.content}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
