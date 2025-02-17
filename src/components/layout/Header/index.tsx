"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.css";

interface HeaderProps {
  shrunk?: boolean;
}

export function Header({ shrunk = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} ${shrunk ? styles.shrunk : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          FeiとFei
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/blog">博客</Link>
          <Link href="/about">关于</Link>
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
            <motion.nav
              className={styles.mobileNav}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/blog" onClick={() => setIsMenuOpen(false)}>
                博客
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                关于
              </Link>
              <ThemeToggle />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
