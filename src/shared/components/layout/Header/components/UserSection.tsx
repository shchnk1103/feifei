"use client";

import { motion } from "framer-motion";
import { menuItemVariants } from "../animations";
import { mergeStyles } from "@/shared/utils/styles";
import mobileStyles from "../styles/mobile.module.css";
import userStyles from "../styles/user.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/modules/auth/utils/auth";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/modules/auth";

const styles = mergeStyles(mobileStyles, userStyles);

interface UserSectionProps {
  mobile?: boolean;
  onClose?: () => void;
  setAuthDialogOpen?: (isOpen: boolean) => void;
}

export function UserSection({
  mobile = false,
  onClose,
  setAuthDialogOpen,
}: UserSectionProps) {
  const { data: session } = useSession();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const Component = mobile ? motion.div : "div";
  const props = mobile ? { variants: menuItemVariants } : {};
  const className = mobile ? styles.mobileUserSection : styles.userSection;
  const usernameClassName = mobile ? styles.mobileUsername : styles.username;

  // 只在非移动端时添加点击外部关闭下拉菜单的事件
  useEffect(() => {
    if (mobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  if (!session?.user) {
    return (
      <button
        className={styles.loginLink}
        onClick={() => {
          setAuthDialogOpen?.(true);
          onClose?.();
        }}
      >
        登录
      </button>
    );
  }

  const userIsAdmin = isAdmin(session.user);
  const displayName =
    session.user.name || session.user.email?.split("@")[0] || "未命名用户";

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      onClose?.();
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  return (
    <Component {...props} className={className} data-testid="user-section">
      <div className={styles.userDropdown} ref={dropdownRef}>
        {!mobile && (
          <button
            className={styles.userProfileButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.userInfo}>
              <Image
                src={session.user.image || "/images/default-avatar.png"}
                alt={displayName}
                width={32}
                height={32}
                className={styles.avatar}
              />
              <span className={usernameClassName}>{displayName}</span>
              <svg
                className={`${styles.dropdownIcon} ${
                  isDropdownOpen ? styles.open : ""
                }`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        )}

        {(isDropdownOpen || mobile) && (
          <div className={styles.dropdownMenu}>
            {mobile && (
              <div
                className={
                  userIsAdmin
                    ? styles.mobileUserInfoWithAdmin
                    : styles.mobileUserInfo
                }
              >
                <Image
                  src={session.user.image || "/images/default-avatar.png"}
                  alt={displayName}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <span className={usernameClassName}>{displayName}</span>
              </div>
            )}
            <Link
              href={`/profile/${displayName}`}
              className={styles.dropdownItem}
              onClick={() => {
                setIsDropdownOpen(false);
                onClose?.();
              }}
            >
              个人资料
            </Link>
            {userIsAdmin && (
              <Link
                href="/admin"
                className={styles.dropdownItem}
                onClick={() => {
                  setIsDropdownOpen(false);
                  onClose?.();
                }}
              >
                管理后台
              </Link>
            )}
            <button
              className={`${styles.dropdownItem} ${styles.logoutButton}`}
              onClick={handleLogout}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </Component>
  );
}
