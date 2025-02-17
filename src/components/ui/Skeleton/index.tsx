import { HTMLAttributes } from "react";
import styles from "./styles.module.css";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "pulse",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`
        ${styles.skeleton}
        ${styles[variant]}
        ${styles[`animation-${animation}`]}
        ${className || ""}
      `}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}
