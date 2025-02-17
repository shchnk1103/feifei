/* filepath: /Users/doubleshy0n/Downloads/Dev/feifei/src/hooks/useTheme.ts */
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem("theme") as Theme;

    setTheme(savedTheme || (prefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
