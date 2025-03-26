import { HTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.css";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: "horizontal" | "vertical";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

export function Stack({
  children,
  direction = "vertical",
  spacing = "md",
  align = "start",
  justify = "start",
  wrap = false,
  className,
  ...props
}: StackProps) {
  const classes = [
    styles.stack,
    styles[direction],
    styles[`spacing-${spacing}`],
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    wrap ? styles.wrap : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
