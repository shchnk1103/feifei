import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { slideUpDown } from "@/utils/animations";
import styles from "./styles.module.css";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  variant?: "default" | "alternate";
  animate?: boolean;
}

export function Section({
  children,
  title,
  subtitle,
  fullWidth = false,
  variant = "default",
  animate = true,
  className,
  ...props
}: SectionProps) {
  const Component = animate ? motion.section : "section";

  return (
    <Component
      className={`
        ${styles.section}
        ${styles[variant]}
        ${fullWidth ? styles.fullWidth : ""}
        ${className || ""}
      `}
      {...(animate && { ...slideUpDown })}
      {...props}
    >
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </Component>
  );
}
