import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ""
      } ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
