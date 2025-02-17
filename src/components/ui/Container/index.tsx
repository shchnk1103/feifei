import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/utils/animations";
import styles from "./styles.module.css";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  center?: boolean;
  animate?: boolean;
}

export function Container({
  children,
  size = "medium",
  center = true,
  animate = true,
  className,
  ...props
}: ContainerProps) {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      className={`
        ${styles.container}
        ${styles[size]}
        ${center ? styles.center : ""}
        ${className || ""}
      `}
      {...(animate && { ...pageTransition })}
      {...props}
    >
      {children}
    </Component>
  );
}
