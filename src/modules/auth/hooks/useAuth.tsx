"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { UserData, UserRegistrationData } from "../types/user";
import { createContext, useContext, useState } from "react";
import { logger } from "@/lib/logger";

/**
 * 认证上下文接口
 * 定义了认证相关的状态和方法
 */
interface AuthContextProps {
  /** 当前用户数据 */
  user: UserData | null;
  /** 当前用户是否为管理员 */
  isAdmin: boolean;
  /** 是否正在加载中 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 用户是否已认证 */
  isAuthenticated: boolean;
  /** 用户登录方法 */
  login: (email: string, password: string) => Promise<UserData>;
  /** 用户登出方法 */
  logout: () => Promise<void>;
  /** 用户注册方法 */
  register: (
    email: string,
    password: string,
    data?: UserRegistrationData
  ) => Promise<void>;
  /** 更新用户资料方法 */
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
  }) => Promise<void>;
  /** 设置用户为管理员方法 */
  setUserAsAdmin: (uid: string) => Promise<void>;
  /** 移除用户管理员权限方法 */
  removeUserAdmin: (uid: string) => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * 认证提供者组件
 *
 * 提供认证相关的状态管理和方法，包括：
 * - 用户认证状态监听
 * - 用户登录、注册、登出
 * - 用户资料管理
 * - 管理员权限管理
 *
 * @param children - 子组件
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<Error | null>(null);

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        role: session.user.role,
        createdAt: new Date(session.user.createdAt),
        updatedAt: new Date(session.user.updatedAt),
      }
    : null;

  const isAdmin = user?.role === "admin";
  const loading = status === "loading";
  const isAuthenticated = !!user;

  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 用户数据
   */
  const login = async (email: string, password: string) => {
    try {
      logger.info("开始登录流程", { email });
      setError(null);

      logger.debug("调用 NextAuth signIn");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      logger.debug("NextAuth signIn 结果", {
        ok: result?.ok,
        error: result?.error,
        url: result?.url,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      logger.debug("等待 session 更新");
      // 等待 session 更新
      await new Promise((resolve) => setTimeout(resolve, 1000));

      logger.debug("获取最新 session");
      // 重新获取 session
      const currentSession = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      logger.debug("获取到的 session", {
        user: currentSession?.user,
        expires: currentSession?.expires,
      });

      if (!currentSession?.user) {
        throw new Error("登录失败：无法获取用户信息");
      }

      const userData: UserData = {
        id: currentSession.user.id,
        email: currentSession.user.email || "",
        name: currentSession.user.name || "",
        role: currentSession.user.role,
        createdAt: new Date(currentSession.user.createdAt),
        updatedAt: new Date(currentSession.user.updatedAt),
      };

      logger.info("登录成功", { userData });
      return userData;
    } catch (error) {
      logger.error("登录失败", {
        error,
        message: error instanceof Error ? error.message : String(error),
      });
      const errorMessage = error instanceof Error ? error.message : "登录失败";
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  /**
   * 用户注册
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @param additionalData - 额外的用户数据
   */
  const register = async (
    email: string,
    password: string,
    additionalData: UserRegistrationData = {}
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ...additionalData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "注册失败");
      }

      // 注册成功后自动登录
      logger.info("注册成功，开始自动登录");
      try {
        await login(email, password);
        logger.info("自动登录成功");
      } catch (loginError) {
        logger.error("注册后自动登录失败", { error: loginError });
        throw loginError;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  /**
   * 用户登出
   * 清除所有用户相关的状态
   */
  const logout = async () => {
    try {
      setError(null);
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  /**
   * 更新用户资料
   * @param data - 要更新的用户资料
   */
  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
  }) => {
    if (!user) throw new Error("未登录");

    try {
      setError(null);
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "更新资料失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  /**
   * 设置用户为管理员
   * @param uid - 目标用户ID
   */
  const setUserAsAdmin = async (uid: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/auth/admin/${uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "admin" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "设置管理员失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  /**
   * 移除用户的管理员权限
   * @param uid - 目标用户ID
   */
  const removeUserAdmin = async (uid: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/auth/admin/${uid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "移除管理员失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateUserProfile,
    setUserAsAdmin,
    removeUserAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 认证钩子
 *
 * 用于在组件中获取和使用认证相关的状态和方法
 * 必须在 AuthProvider 内部使用
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout } = useAuth();
 *
 *   return (
 *     <div>
 *       {user ? (
 *         <button onClick={logout}>登出</button>
 *       ) : (
 *         <button onClick={() => login('email', 'password')}>登录</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @throws {Error} 如果在 AuthProvider 外部使用
 * @returns {AuthContextProps} 认证上下文
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必须在 AuthProvider 内部使用");
  }
  return context;
};
