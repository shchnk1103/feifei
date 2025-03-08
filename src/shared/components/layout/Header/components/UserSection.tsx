"use client";

import { motion } from "framer-motion";
import { menuItemVariants } from "../animations";
import { mergeStyles } from "@/shared/utils/styles";
import mobileStyles from "../styles/mobile.module.css";
import userStyles from "../styles/user.module.css";
import Image from "next/image";
import {
  UserInfo,
  getUserDisplayName,
  getUserAvatar,
  isAdmin,
  isUserLoggedIn,
} from "@/modules/auth/types/user";

const styles = mergeStyles(mobileStyles, userStyles);

interface UserSectionProps {
  user: UserInfo;
  mobile?: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onClose?: () => void;
}

export function UserSection({
  user,
  mobile,
  onLogin,
  onLogout,
  onClose,
}: UserSectionProps) {
  const Component = mobile ? motion.div : "div";
  const props = mobile ? { variants: menuItemVariants } : {};
  const className = mobile ? styles.mobileUserSection : styles.userSection;
  const buttonClassName = mobile ? styles.mobileAuthButton : styles.authButton;
  const usernameClassName = mobile ? styles.mobileUsername : styles.username;

  // 检查用户是否登录
  const isLoggedIn = isUserLoggedIn(user);

  return (
    <Component {...props} className={className} data-testid="user-section">
      {isLoggedIn ? (
        <>
          <Image
            src={getUserAvatar(user)}
            alt="用户头像"
            className={styles.userAvatar}
            width={32}
            height={32}
          />
          <span className={usernameClassName}>{getUserDisplayName(user)}</span>
          {isAdmin(user) && <span className={styles.adminBadge}>管理员</span>}
          <button
            onClick={() => {
              onLogout();
              onClose?.();
            }}
            className={buttonClassName}
          >
            登出
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            onLogin();
            onClose?.();
          }}
          className={buttonClassName}
          aria-label="登录"
        >
          登录
        </button>
      )}
    </Component>
  );
}
