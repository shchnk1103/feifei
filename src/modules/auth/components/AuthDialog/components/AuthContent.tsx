"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as RadixDialog from "@radix-ui/react-dialog";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { contentVariants, formVariants } from "../animations";
import styles from "../styles.module.css";
import { AuthTabs } from "./AuthTabs";

interface AuthContentProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  onClose: () => void;
  className?: string;
}

export function AuthContent({
  mode,
  onModeChange,
  onClose,
  className,
}: AuthContentProps) {
  return (
    <RadixDialog.Content asChild>
      <motion.div
        className={`${styles.content} ${className || ""}`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <RadixDialog.Title className={styles.title}>
          {mode === "login" ? "登录" : "注册"}
        </RadixDialog.Title>

        <AuthTabs mode={mode} onModeChange={onModeChange} />

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

        <RadixDialog.Close asChild>
          <button className={styles.closeButton}>
            <span aria-hidden>×</span>
          </button>
        </RadixDialog.Close>
      </motion.div>
    </RadixDialog.Content>
  );
}
