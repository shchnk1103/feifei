"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { itemVariants } from "../headerAnimations";

interface NavItemsProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function NavItems({ mobile = false, onClose }: NavItemsProps) {
  const pathname = usePathname();
  const Component = mobile ? motion.div : "div";
  const props = mobile ? { variants: itemVariants } : {};

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  if (mobile) {
    return (
      <Component {...props} className="mobile-nav-item">
        <Link
          href="/"
          onClick={onClose}
          className={`nav-link ${isActive("/blog") ? "active" : ""}`}
        >
          博客
        </Link>

        <Link
          href="/about"
          onClick={onClose}
          className={`nav-link ${isActive("/about") ? "active" : ""}`}
        >
          关于
        </Link>

        <Link
          href="/settings"
          onClick={onClose}
          className={`nav-link ${isActive("/settings") ? "active" : ""}`}
        >
          设置
        </Link>
      </Component>
    );
  }

  return (
    <Component {...props} className="nav-items">
      <Link
        href="/blog"
        className={`nav-link ${isActive("/blog") ? "active" : ""}`}
      >
        博客
      </Link>

      <Link
        href="/about"
        className={`nav-link ${isActive("/about") ? "active" : ""}`}
      >
        关于
      </Link>

      <Link
        href="/settings"
        className={`nav-link ${isActive("/settings") ? "active" : ""}`}
      >
        设置
      </Link>
    </Component>
  );
}
