/**
 * @file useMounted.ts
 * @description
 * 判断组件是否已挂载（即仅在客户端渲染时为 true），
 * 常用于避免 Next.js SSR/CSR 水合不一致问题或需要等到客户端渲染后再显示内容的场景。
 *
 * 用法示例：
 *   const isMounted = useMounted();
 *   if (!isMounted) return null; // 或返回占位内容
 */

"use client";

import { useState, useEffect } from "react";

/**
 * 判断组件是否已挂载的自定义 Hook
 * @returns {boolean} isMounted - 组件是否已挂载
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
