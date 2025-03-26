"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  selector?: string;
}

/**
 * Portal组件 - 将内容渲染到DOM树的其他位置
 * @param children 需要传送的内容
 * @param selector 目标DOM选择器，默认为"body"
 */
export function Portal({ children, selector = "body" }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = document.querySelector(selector);
  if (!target) return null;

  return createPortal(children, target);
}
