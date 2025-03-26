"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Theme, ThemeContextType } from "../types/theme";

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者属性接口
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题提供者组件
 * 管理应用程序的主题状态并提供相关功能
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");

  // 初始化主题 - 从localStorage读取保存的设置
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // 当主题变化时应用主题
  useEffect(() => {
    const root = window.document.documentElement;

    // 判断是否使用深色主题
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // 移除之前的主题类
    root.classList.remove("light", "dark");

    // 添加新的主题类
    root.classList.add(isDark ? "dark" : "light");

    // 设置data-theme属性
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    // 保存设置到localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  // 提供主题上下文
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题的自定义Hook
 * 提供对主题状态和操作的访问
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
