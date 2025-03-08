export const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const menuItemVariants = {
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};
