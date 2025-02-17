import { HTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { pageTransition } from "@/utils/animations";
import styles from "./styles.module.css";
import { cn } from "@/utils/cn";

type ContainerBaseProps = {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  center?: boolean;
  animate?: boolean;
};

// Separate props for motion and static divs
type MotionContainerProps = ContainerBaseProps &
  Omit<HTMLMotionProps<"div">, keyof ContainerBaseProps>;

type StaticContainerProps = ContainerBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ContainerBaseProps>;

// Use discriminated union type
type ContainerProps =
  | (MotionContainerProps & { animate: true })
  | (StaticContainerProps & { animate?: false });

export function Container({
  children,
  size = "medium",
  center = true,
  animate = true,
  className,
  ...props
}: ContainerProps) {
  if (animate) {
    return (
      <motion.div
        className={cn(
          styles.container,
          styles[size],
          center && styles.center,
          className
        )}
        {...pageTransition}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        center && styles.center,
        className
      )}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
