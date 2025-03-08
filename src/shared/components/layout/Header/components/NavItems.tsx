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

  return (
    <Component
      {...props}
      className={mobile ? styles.mobileNavItem : styles.navItem}
    >
      <Link href="/blog" onClick={onClose}>
        博客
      </Link>
      <Link href="/about" onClick={onClose}>
        关于
      </Link>
    </Component>
  );
}
