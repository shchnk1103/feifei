import { forwardRef } from "react";
import { InputProps } from "./types";
import styles from "./styles.module.css";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      fullWidth = false,
      variant = "outlined",
      startIcon,
      endIcon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`
          ${styles.container}
          ${fullWidth ? styles.fullWidth : ""}
          ${className || ""}
        `}
      >
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputWrapper} ${styles[variant]}`}>
          {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
          <input
            ref={ref}
            className={`
              ${styles.input}
              ${error ? styles.error : ""}
              ${startIcon ? styles.hasStartIcon : ""}
              ${endIcon ? styles.hasEndIcon : ""}
            `}
            {...props}
          />
          {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
        </div>
        {(error || helper) && (
          <p className={`${styles.message} ${error ? styles.error : ""}`}>
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
