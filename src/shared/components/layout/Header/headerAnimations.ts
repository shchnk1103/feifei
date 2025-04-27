/**
 * @file headerAnimations.ts
 * @description
 * 本文件集中定义了 Header 相关的 framer-motion 动画配置，供 Header 及其子组件（如移动端菜单、导航项、主题切换按钮等）统一调用。
 *
 * - overlayVariants：用于菜单遮罩层的淡入淡出动画。
 * - menuVariants：用于移动端菜单弹出的整体动画。
 * - itemsContainerVariants：用于菜单项容器的子项级联动画。
 * - itemVariants：用于单个菜单项的进出场动画（已合并 menuItemVariants）。
 * - themeToggleVariants：用于主题切换按钮的动画。
 *
 * 这样做的好处是动画配置集中管理，便于维护和复用，避免重复定义和命名冲突。
 *
 * 使用方式：
 *   import { itemVariants } from "./headerAnimations";
 *   <motion.div variants={itemVariants}>...</motion.div>
 */

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const menuVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
};

export const itemsContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
      staggerDirection: 1,
      when: "beforeChildren",
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

// 合并 menuItemVariants 和 itemVariants，统一命名为 itemVariants
export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
};

export const themeToggleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};
