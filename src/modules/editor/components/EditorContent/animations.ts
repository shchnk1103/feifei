/**
 * 编辑器动画配置
 * 集中管理组件中使用的所有动画配置
 */
export const animations = {
  /**
   * 内容块的动画配置
   */
  block: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, height: 0, overflow: "hidden" },
    transition: { duration: 0.3 },
  },

  /**
   * 添加按钮的动画配置
   */
  addButton: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2 },
  },

  /**
   * 封面图片的动画配置
   */
  coverImage: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  /**
   * 空白占位符的动画配置
   */
  emptyPlaceholder: {
    initial: { opacity: 0 },
    animate: (isVisible: boolean, isHovered: boolean) => ({
      opacity: isVisible ? (isHovered ? 1 : 0.4) : 0,
      height: isVisible ? "auto" : 0,
      marginTop: isVisible ? "1rem" : 0,
      marginBottom: isVisible ? "1rem" : 0,
    }),
    transition: { duration: 0.3 },
  },

  /**
   * 生成带有延迟的过渡效果，用于瀑布式动画
   * @param index 当前元素的索引
   * @param total 元素总数
   * @returns 带有延迟的过渡配置
   */
  getDelayedTransition: (index: number, total: number) => ({
    delay: Math.min(index * 0.05, 0.5), // 限制最大延迟为0.5秒
    staggerChildren: 0.05,
    // 为最后一个块添加不同的动画设置
    duration: index === total - 1 ? 0.4 : 0.3,
  }),
};
