"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { ThemeToggle } from "@/modules/theme";
import { AuthDialog } from "@/modules/auth";
import { NavItems } from "./components/NavItems";
import { UserSection } from "./components/UserSection";

interface HeaderProps {
  shrunk?: boolean;
}

export function Header({ shrunk = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // 锁定滚动
  useScrollLock(isMenuOpen);

  // 统一处理菜单关闭逻辑
  const handleCloseMenu = useCallback(() => {
    if (isMenuOpen && !isAnimatingOut) {
      setIsAnimatingOut(true);
      // 允许动画完成后再更新状态
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimatingOut(false);
      }, 400); // 与动画持续时间同步
    }
  }, [isMenuOpen, isAnimatingOut]);

  // 处理菜单切换
  const handleToggleMenu = useCallback(() => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen, handleCloseMenu]);

  // 处理认证对话框的打开
  const handleOpenAuthDialog = useCallback(() => {
    // 如果菜单是打开的，先关闭它
    if (isMenuOpen) {
      handleCloseMenu();
    }
    setIsAuthDialogOpen(true);
  }, [isMenuOpen, handleCloseMenu]);

  // 处理认证对话框的关闭
  const handleCloseAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false);
  }, []);

  // 确保组件在客户端渲染后再显示内容
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 当路由变化时自动关闭菜单
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMenuOpen) {
        handleCloseMenu();
      }
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isMenuOpen, handleCloseMenu]);

  // 监听ESC键关闭菜单
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen, handleCloseMenu]);

  if (!isMounted) {
    // 返回一个占位符，保持相同大小以避免布局偏移
    return (
      <header className={`header ${shrunk ? "shrunk" : ""}`}>
        <div className="container">
          <span className="logo">FeiとFei</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-lg)",
            }}
          ></div>
        </div>
      </header>
    );
  }

  // 动画配置
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
  };

  const itemsContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        staggerDirection: 1,
        when: "beforeChildren",
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
  };

  const themeToggleVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <header className={`header ${shrunk ? "shrunk" : ""}`}>
        <div className="container">
          <Link href="/" className="logo">
            FeiとFei
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <NavItems />
            <UserSection setAuthDialogOpen={handleOpenAuthDialog} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="menu-button"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`menu-icon ${isMenuOpen ? "open" : ""}`} />
          </button>

          {/* Mobile Navigation */}
          <AnimatePresence
            mode="wait"
            onExitComplete={() => setIsAnimatingOut(false)}
          >
            {isMenuOpen && (
              <>
                <motion.div
                  className="overlay"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={handleCloseMenu}
                  style={{ zIndex: "var(--z-index-modal)" }}
                />
                <motion.div
                  className="mobile-nav"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ zIndex: "var(--z-index-modal)" }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="移动导航菜单"
                >
                  <motion.div
                    className="mobile-content"
                    onClick={(e) => {
                      // 如果点击的是mobileContent本身（空白区域），而不是其子元素，则关闭菜单
                      if (e.target === e.currentTarget) {
                        handleCloseMenu();
                      }
                    }}
                  >
                    <motion.nav
                      className="mobile-nav-items"
                      variants={itemsContainerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={itemVariants}>
                        <NavItems mobile onClose={handleCloseMenu} />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <UserSection
                          mobile
                          onClose={handleCloseMenu}
                          setAuthDialogOpen={handleOpenAuthDialog}
                        />
                      </motion.div>

                      <motion.div variants={themeToggleVariants}>
                        <ThemeToggle />
                      </motion.div>
                    </motion.nav>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* AuthDialog */}
        <AuthDialog isOpen={isAuthDialogOpen} onClose={handleCloseAuthDialog} />
      </header>

      {/* 桌面端固定的ThemeToggle */}
      <div className="desktop-theme-toggle" title="切换主题模式">
        <ThemeToggle />
      </div>
    </>
  );
}
