import * as RadixDialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import styles from "./styles.module.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function Dialog({ open, onClose, children, className }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            <RadixDialog.Portal forceMount>
              <RadixDialog.Overlay asChild>
                <motion.div
                  className={styles.overlay}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                  transition={{ duration: 0.2 }}
                />
              </RadixDialog.Overlay>

              <RadixDialog.Content asChild>
                <motion.div
                  className={cn(styles.content, className)}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                  transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
                >
                  {children}
                  <RadixDialog.Close className={styles.closeButton}>
                    <span aria-hidden>×</span>
                  </RadixDialog.Close>
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          </>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}
