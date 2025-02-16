//// filepath: /Users/doubleshy0n/Downloads/Dev/feifei/src/components/Modal.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  // 给 Escape 键添加关闭监听，方便使用
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 确保 modal node 存在于 body 下
  return createPortal(<div>{children}</div>, document.body);
}
