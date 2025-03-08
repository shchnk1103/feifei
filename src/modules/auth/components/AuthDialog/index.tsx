"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as RadixDialog from "@radix-ui/react-dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "./styles.module.css";

type AuthMode = "login" | "register";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string; // Make className optional
}

export function AuthDialog({ isOpen, onClose, className }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onClose}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={className}>
          <RadixDialog.Content className={styles.content}>
            <RadixDialog.Title className={styles.title}>
              {mode === "login" ? "登录" : "注册"}
            </RadixDialog.Title>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  mode === "login" ? styles.active : ""
                }`}
                onClick={() => setMode("login")}
              >
                登录
              </button>
              <button
                className={`${styles.tab} ${
                  mode === "register" ? styles.active : ""
                }`}
                onClick={() => setMode("register")}
              >
                注册
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial="enter"
                animate="center"
                exit="exit"
                variants={formVariants}
              >
                {mode === "login" ? (
                  <LoginForm onClose={onClose} />
                ) : (
                  <RegisterForm onClose={onClose} />
                )}
              </motion.div>
            </AnimatePresence>

            <RadixDialog.Close className={styles.closeButton}>
              <span aria-hidden>×</span>
            </RadixDialog.Close>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

const formVariants = {
  enter: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 },
  },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.3 },
  },
};
