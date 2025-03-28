import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./styles.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "warning";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  rounded?: boolean;
  loadingText?: string;
  ariaLabel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "left",
      rounded = false,
      className,
      disabled,
      loadingText,
      ariaLabel,
      type = "button",
      ...props
    },
    ref
  ) => {
    // 生成适当的ARIA属性
    const ariaProps = {
      role: "button",
      "aria-disabled": disabled || loading ? true : undefined,
      "aria-busy": loading ? true : undefined,
      "aria-label": ariaLabel,
    };

    // 如果提供了加载文本，则在加载时应用屏幕阅读器文本
    const srOnlyText =
      loading && loadingText ? (
        <span className={styles.srOnly}>{loadingText}</span>
      ) : null;

    return (
      <button
        ref={ref}
        className={`${styles.button} 
                  ${styles[variant]} 
                  ${styles[size]} 
                  ${fullWidth ? styles.fullWidth : ""} 
                  ${loading ? styles.loading : ""} 
                  ${rounded ? styles.rounded : ""} 
                  ${className || ""}`}
        disabled={disabled || loading}
        type={type}
        {...ariaProps}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}

        {srOnlyText}

        {!loading && icon && iconPosition === "left" && (
          <span className={styles.iconLeft} aria-hidden="true">
            {icon}
          </span>
        )}

        {children && (
          <span className={loading ? styles.invisible : ""}>{children}</span>
        )}

        {!loading && icon && iconPosition === "right" && (
          <span className={styles.iconRight} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
