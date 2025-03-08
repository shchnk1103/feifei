import { HTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.css";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  autoFit?: boolean;
  minWidth?: string;
}

export function Grid({
  children,
  columns = 3,
  gap = "md",
  autoFit = false,
  minWidth = "250px",
  ...props
}: GridProps) {
  return (
    <div
      className={`
        ${styles.grid}
        ${!autoFit ? styles[`cols-${columns}`] : ""}
        ${styles[`gap-${gap}`]}
        ${autoFit ? styles.autoFit : ""}
      `}
      style={
        autoFit
          ? ({ "--min-width": minWidth } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}
