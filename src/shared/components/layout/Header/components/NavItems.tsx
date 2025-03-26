"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { menuItemVariants } from "../animations";
import { mergeStyles } from "@/shared/utils/styles";
import mobileStyles from "../styles/mobile.module.css";
import desktopStyles from "../styles/desktop.module.css";

const styles = mergeStyles(mobileStyles, desktopStyles);

interface NavItemsProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function NavItems({ mobile = false, onClose }: NavItemsProps) {
  const Component = mobile ? motion.div : "div";
  const props = mobile ? { variants: menuItemVariants } : {};

  if (mobile) {
    return (
      <Component {...props} className={styles.mobileNavItem}>
        <Link href="/blog" onClick={onClose} className={styles.mobileNavLink}>
          博客
        </Link>
        <Link href="/about" onClick={onClose} className={styles.mobileNavLink}>
          关于
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className={styles.mobileNavLink}
        >
          设置
        </Link>
      </Component>
    );
  }

  return (
    <Component {...props} className={styles.navItem}>
      <Link href="/blog">博客</Link>
      <Link href="/about">关于</Link>
      <Link href="/settings">设置</Link>
    </Component>
  );
}
