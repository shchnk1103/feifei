"use client";

import { motion } from "framer-motion";
import { menuItemVariants } from "../animations";
import { mergeStyles } from "@/shared/utils/styles";
import mobileStyles from "../styles/mobile.module.css";
import userStyles from "../styles/user.module.css";
import Image from "next/image";
import Link from "next/link";
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
  const userIsAdmin = isAdmin(user);
  const displayName = getUserDisplayName(user);

  console.log("Debug UserSection:", {
    isLoggedIn,
    userIsAdmin,
    displayName,
    user: {
      firebaseUser: user.firebaseUser
        ? {
            uid: user.firebaseUser.uid,
            displayName: user.firebaseUser.displayName,
            email: user.firebaseUser.email,
          }
        : null,
      userData: user.userData,
    },
  });

  // 用户个人资料链接
  const profileLink = isLoggedIn
    ? `/profile/${
        user.firebaseUser?.email?.split("@")[0] || user.firebaseUser?.uid
      }`
    : "/login";

  // 处理个人资料链接点击事件
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      onLogin();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Component {...props} className={className} data-testid="user-section">
      {isLoggedIn ? (
        mobile ? (
          <>
            <Link
              href={profileLink}
              className={styles.userProfileLink}
              onClick={handleProfileClick}
            >
              <div
                className={
                  userIsAdmin
                    ? styles.mobileUserInfoWithAdmin
                    : styles.mobileUserInfo
                }
              >
                <Image
                  src={getUserAvatar(user)}
                  alt="用户头像"
                  className={styles.userAvatar}
                  width={48}
                  height={48}
                />
                <div className={styles.mobileUserDetails}>
                  <span className={usernameClassName}>{displayName}</span>
                  {userIsAdmin && (
                    <span className={styles.adminBadge}>管理员</span>
                  )}
                </div>
              </div>
            </Link>
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
          <>
            <Link
              href={profileLink}
              className={styles.userProfileLink}
              onClick={handleProfileClick}
            >
              <Image
                src={getUserAvatar(user)}
                alt="用户头像"
                className={styles.userAvatar}
                width={32}
                height={32}
              />
              <span className={usernameClassName}>{displayName}</span>
              {userIsAdmin && <span className={styles.adminBadge}>管理员</span>}
            </Link>
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
        )
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
