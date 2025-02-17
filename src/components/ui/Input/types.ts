import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
