"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/modules/auth";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { ThemeToggle } from "@/modules/theme";
import { AuthDialog } from "@/modules/auth";
import { NavItems } from "./components/NavItems";
import { UserSection } from "./components/UserSection";
import { menuVariants } from "./animations";
import { mergeStyles } from "@/shared/utils/styles";
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
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useScrollLock(isMenuOpen);

  return (
    <header className={`${styles.header} ${shrunk ? styles.shrunk : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          FeiとFei
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <NavItems />
          <UserSection />
          <ThemeToggle />
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                className={styles.mobileNav}
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
              >
                <motion.div
                  className={styles.mobileContent}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <nav className={styles.mobileNavItems}>
                    <NavItems mobile onClose={() => setIsMenuOpen(false)} />
                    <UserSection mobile onClose={() => setIsMenuOpen(false)} />
                    <ThemeToggle />
                  </nav>
                </motion.div>
              </motion.div>
              <motion.div
                className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
        />
      </div>
    </header>
  );
}
