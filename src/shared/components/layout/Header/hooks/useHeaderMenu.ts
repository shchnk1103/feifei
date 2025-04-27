/**
 * @file useHeaderMenu.ts
 * @description
 * Header 菜单（如移动端抽屉菜单）开关、动画、路由和 ESC 键监听等逻辑的自定义 Hook。
 * 适用于需要菜单动画和交互的场景，自动处理菜单关闭、动画状态、路由变化和键盘事件。
 *
 * 用法示例：
 *   const { isMenuOpen, handleCloseMenu, handleToggleMenu } = useHeaderMenu();
 *   <button onClick={handleToggleMenu}>菜单</button>
 */

"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Header 菜单控制 Hook
 * @returns 菜单开关、动画状态及相关操作方法
 */
export function useHeaderMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  /**
   * 关闭菜单（带动画）
   */
  const handleCloseMenu = useCallback(() => {
    if (isMenuOpen && !isAnimatingOut) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimatingOut(false);
      }, 400);
    }
  }, [isMenuOpen, isAnimatingOut]);

  /**
   * 切换菜单开关
   */
  const handleToggleMenu = useCallback(() => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen, handleCloseMenu]);

  // 路由变化自动关闭菜单
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMenuOpen) {
        handleCloseMenu();
      }
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [isMenuOpen, handleCloseMenu]);

  // ESC 键关闭菜单
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        handleCloseMenu();
      }
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleEscKey);
    }
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isMenuOpen, handleCloseMenu]);

  return {
    isMenuOpen,
    isAnimatingOut,
    handleCloseMenu,
    handleToggleMenu,
    setIsAnimatingOut,
    setIsMenuOpen,
  };
}
