"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { ThemeToggle } from "@/modules/theme";
import { AuthDialog } from "@/modules/auth";
import { NavItems } from "./components/NavItems";
import { UserSection } from "./components/UserSection";
import {
  overlayVariants,
  menuVariants,
  itemsContainerVariants,
  itemVariants,
  themeToggleVariants,
} from "./headerAnimations";
import { useHeaderMenu } from "./hooks/useHeaderMenu";
import { useAuthDialog } from "./hooks/useAuthDialog";
import { useMounted } from "./hooks/useMounted";

interface HeaderProps {
  shrunk?: boolean;
}

export function Header({ shrunk = false }: HeaderProps) {
  const { isMenuOpen, handleCloseMenu, handleToggleMenu, setIsAnimatingOut } =
    useHeaderMenu();
  const { isAuthDialogOpen, handleOpenAuthDialog, handleCloseAuthDialog } =
    useAuthDialog(isMenuOpen, handleCloseMenu);
  const isMounted = useMounted();

  // 锁定滚动
  useScrollLock(isMenuOpen);

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
