"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as RadixDialog from "@radix-ui/react-dialog";
import { overlayVariants } from "./animations";
import styles from "./styles.module.css";
import { AuthContent } from "./components/AuthContent";

type AuthMode = "login" | "register";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AuthDialog({ isOpen, onClose, className }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <RadixDialog.Root open={true} onOpenChange={onClose}>
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div
                className={styles.overlay}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (e.target === e.currentTarget) {
                    onClose();
                  }
                }}
              >
                <AuthContent
                  mode={mode}
                  onModeChange={setMode}
                  onClose={onClose}
                  className={className}
                />
              </motion.div>
            </RadixDialog.Overlay>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      )}
    </AnimatePresence>
  );
}
