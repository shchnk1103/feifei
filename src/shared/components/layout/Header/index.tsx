"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { ThemeToggle } from "@/modules/theme";
import { AuthDialog } from "@/modules/auth";
import { NavItems } from "./components/NavItems";
import { UserSection } from "./components/UserSection";
import { mergeStyles } from "@/shared/utils/styles";
import { Portal } from "@/shared/components/ui/Portal";
import baseStyles from "./styles/base.module.css";
import desktopStyles from "./styles/desktop.module.css";
import mobileStyles from "./styles/mobile.module.css";
import userStyles from "./styles/user.module.css";
import indexStyles from "./styles/index.module.css";

const styles = mergeStyles(
  baseStyles,
  desktopStyles,
  mobileStyles,
  userStyles,
  indexStyles
);

interface HeaderProps {
  shrunk?: boolean;
}

export function Header({ shrunk = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useScrollLock(isMenuOpen);

  // 确保组件在客户端渲染后再显示Portal内容
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${shrunk ? styles.shrunk : ""} ${
          styles.userProfileStyles
        }`}
      >
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            FeiとFei
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <NavItems />
            <UserSection setAuthDialogOpen={setIsAuthDialogOpen} />
            {/* 移动端ThemeToggle在导航中 */}
            <div className={styles.mobileThemeToggle}>
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${styles.menuIcon} ${isMenuOpen ? styles.open : ""}`}
            />
          </button>

          {/* Mobile Navigation - 使用Portal确保在DOM树顶层显示 */}
          {isMounted && (
            <AnimatePresence>
              {isMenuOpen && (
                <Portal>
                  <>
                    <motion.div
                      className={styles.overlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ zIndex: "var(--z-index-modal)" }}
                    />
                    <motion.div
                      className={styles.mobileNav}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      style={{ zIndex: "var(--z-index-modal)" }}
                    >
                      <motion.div
                        className={styles.mobileContent}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        onClick={(e) => {
                          // 如果点击的是mobileContent本身（空白区域），而不是其子元素，则关闭菜单
                          if (e.target === e.currentTarget) {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        <nav className={styles.mobileNavItems}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                          >
                            <NavItems
                              mobile
                              onClose={() => setIsMenuOpen(false)}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <UserSection
                              mobile
                              onClose={() => setIsMenuOpen(false)}
                              setAuthDialogOpen={setIsAuthDialogOpen}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <ThemeToggle />
                          </motion.div>
                        </nav>
                      </motion.div>
                    </motion.div>
                  </>
                </Portal>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* 在组件顶层渲染 AuthDialog */}
        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
        />
      </header>

      {/* 桌面端固定的ThemeToggle */}
      <div className={styles.desktopThemeToggle}>
        <ThemeToggle />
      </div>
    </>
  );
}
