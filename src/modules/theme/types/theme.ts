/**
 * 主题类型定义
 */

// 主题选项：亮色、暗色或跟随系统
export type Theme = "light" | "dark" | "system";

// 主题上下文接口
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
