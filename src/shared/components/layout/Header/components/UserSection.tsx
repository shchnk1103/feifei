"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { ChevronDown } from "@/shared/components/icons/ChevronDown";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";

interface UserSectionProps {
  mobile?: boolean;
  onClose?: () => void;
  setAuthDialogOpen: (open: boolean) => void;
}

export function UserSection({
  mobile = false,
  onClose,
  setAuthDialogOpen,
}: UserSectionProps) {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { ref } = useOnClickOutside<HTMLDivElement>(() =>
    setIsDropdownOpen(false)
  );

  // 只在非移动端时添加点击外部关闭下拉菜单的事件
  useEffect(() => {
    if (mobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    if (mobile && onClose) {
      onClose();
    }
  };

  const handleOpenAuthDialog = () => {
    setAuthDialogOpen(true);
    if (mobile && onClose) {
      onClose();
    }
  };

  // 如果未登录，显示登录按钮
  if (!session?.user) {
    return (
      <button
        className="user-button login-button"
        onClick={() => {
          setAuthDialogOpen?.(true);
          onClose?.();
        }}
      >
        登录
      </button>
    );
  }

  // 如果是移动端
  if (mobile) {
    return (
      <div className="mobile-user-section">
        {status === "authenticated" && session?.user ? (
          <div
            className={
              session.user.role === "admin"
                ? "mobile-user-info-admin"
                : "mobile-user-info"
            }
          >
            <div className="user-avatar-container">
              <OptimizedImage
                src={session.user.image || "/images/default-avatar.png"}
                alt={session.user.name || "User"}
                width={80}
                height={80}
                className="user-avatar"
              />
            </div>
            <span className="mobile-username">{session.user.name}</span>
            <div
              className="user-actions"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {session.user.role === "admin" && (
                <Link href="/admin" className="user-button" onClick={onClose}>
                  管理后台
                </Link>
              )}

              <Link
                href={`/profile/${session.user.id}`}
                className="user-button"
                onClick={onClose}
              >
                个人资料
              </Link>

              <Link href="/settings" className="user-button" onClick={onClose}>
                设置
              </Link>

              <button
                onClick={handleLogout}
                className="user-button logout-button"
              >
                退出登录
              </button>
            </div>
          </div>
        ) : (
          <div
            className="login-container"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              margin: "1rem 0",
            }}
          >
            <button
              onClick={handleOpenAuthDialog}
              className="user-button"
              style={{ fontSize: "1.1rem", padding: "1rem" }}
            >
              登录 / 注册
            </button>
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.7,
                textAlign: "center",
                margin: "0.5rem 0",
              }}
            >
              登录后体验更多功能
            </p>
          </div>
        )}
      </div>
    );
  }

  // 桌面端
  return (
    <div className="user-section">
      {status === "authenticated" && session?.user ? (
        <div className="relative" ref={ref}>
          <div
            className="user-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="user-info">
              <OptimizedImage
                src={session.user.image || "/images/default-avatar.png"}
                alt={session.user.name || "User"}
                width={36}
                height={36}
                className="user-avatar"
              />
              <span className="user-name">{session.user.name}</span>
            </div>
            <ChevronDown
              className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
            />
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="dropdown-menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {session.user.role === "admin" && (
                  <Link href="/admin" className="dropdown-item">
                    管理后台
                  </Link>
                )}

                <Link
                  href={`/profile/${session.user.id}`}
                  className="dropdown-item"
                >
                  个人资料
                </Link>

                <Link href="/settings" className="dropdown-item">
                  设置
                </Link>

                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-button"
                >
                  退出登录
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <button
          onClick={() => setAuthDialogOpen(true)}
          className="login-button"
        >
          登录 / 注册
        </button>
      )}
    </div>
  );
}
