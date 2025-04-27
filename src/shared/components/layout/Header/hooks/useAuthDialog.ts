/**
 * @file useAuthDialog.ts
 * @description
 * 认证弹窗（如登录/注册）开关逻辑的自定义 Hook。
 * 自动处理"打开弹窗前先关闭菜单"的需求，适用于 Header 等需要弹窗和菜单联动的场景。
 *
 * 用法示例：
 *   const { isAuthDialogOpen, handleOpenAuthDialog, handleCloseAuthDialog } = useAuthDialog(isMenuOpen, handleCloseMenu);
 *   <AuthDialog isOpen={isAuthDialogOpen} onClose={handleCloseAuthDialog} />
 */

"use client";

import { useState, useCallback } from "react";

/**
 * 认证弹窗控制 Hook
 * @param isMenuOpen - 当前菜单是否打开
 * @param handleCloseMenu - 关闭菜单的方法
 * @returns 控制认证弹窗的状态和方法
 */
export function useAuthDialog(
  isMenuOpen: boolean,
  handleCloseMenu: () => void
) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  /**
   * 打开认证弹窗（如有菜单则先关闭菜单）
   */
  const handleOpenAuthDialog = useCallback(() => {
    if (isMenuOpen) {
      handleCloseMenu();
    }
    setIsAuthDialogOpen(true);
  }, [isMenuOpen, handleCloseMenu]);

  /**
   * 关闭认证弹窗
   */
  const handleCloseAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false);
  }, []);

  return {
    isAuthDialogOpen,
    handleOpenAuthDialog,
    handleCloseAuthDialog,
    setIsAuthDialogOpen,
  };
}
