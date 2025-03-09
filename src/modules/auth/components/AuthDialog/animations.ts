/**
 * 认证对话框的动画变体定义
 */

// 遮罩层动画变体
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// 内容区域动画变体
export const contentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
};

// 表单切换动画变体
export const formVariants = {
  enter: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 },
  },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.3 },
  },
};
