"use client";

import { useTheme } from "../../contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./styles.module.css";

/**
 * 主题切换按钮组件
 * 允许用户在浅色、深色和系统主题之间切换
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="切换主题"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" && (
          <motion.svg
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 3v1M12 20v1M3 12h1M20 12h1M5.05 5.05l.707.707M18.243 18.243l.707.707M18.243 5.05l-.707.707M5.05 18.243l-.707.707"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>
        )}

        {theme === "dark" && (
          <motion.svg
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}

        {theme === "system" && (
          <motion.svg
            key="system"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M14 15v2M10 15v2M8 19h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
