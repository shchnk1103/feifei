import { HTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { slideUpDown } from "@/utils/animations";
import { cn } from "@/utils/cn";
import styles from "./styles.module.css";

type SectionBaseProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  variant?: "default" | "alternate";
  animate?: boolean;
};

type MotionSectionProps = SectionBaseProps &
  Omit<HTMLMotionProps<"section">, keyof SectionBaseProps>;

type StaticSectionProps = SectionBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof SectionBaseProps>;

type SectionProps =
  | (MotionSectionProps & { animate: true })
  | (StaticSectionProps & { animate?: false });

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
  if (animate) {
    return (
      <motion.section
        className={cn(
          styles.section,
          styles[variant],
          fullWidth && styles.fullWidth,
          className
        )}
        {...slideUpDown}
        {...(props as HTMLMotionProps<"section">)}
      >
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        <div className={styles.content}>{children}</div>
      </motion.section>
    );
  }

  return (
    <section
      className={cn(
        styles.section,
        styles[variant],
        fullWidth && styles.fullWidth,
        className
      )}
      {...(props as HTMLAttributes<HTMLElement>)}
    >
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
