// 使用命名空间导出模块，避免命名冲突
import * as Auth from "./modules/auth";
import * as Blog from "./modules/blog";
import * as Editor from "./modules/editor";
import * as Theme from "./modules/theme";
import * as Shared from "./shared";

// 导出命名空间
export { Auth, Blog, Editor, Theme, Shared };

// 导出常用组件和钩子，方便直接使用
export { AuthDialog, useAuth, AuthProvider } from "./modules/auth";
export { ArticleContent, ArticleHeader, useArticle } from "./modules/blog";
export { ThemeToggle, ThemeProvider, useTheme } from "./modules/theme";

// 导出共享UI组件
export {
  Button,
  Card,
  Input,
  Modal,
  Dialog,
  Container,
  Section,
} from "./shared";

// 导出库
export * from "./lib/firebase/config";
export * from "./lib/firebase/utils";
