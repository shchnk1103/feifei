"use client";

import styles from "../styles.module.css";

interface AuthTabsProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export function AuthTabs({ mode, onModeChange }: AuthTabsProps) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
        onClick={() => onModeChange("login")}
      >
        登录
      </button>
      <button
        className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
        onClick={() => onModeChange("register")}
      >
        注册
      </button>
    </div>
  );
}
