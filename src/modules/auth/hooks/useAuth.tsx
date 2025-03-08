"use client";

"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { User } from "firebase/auth";
import { authService } from "../services/authService";
import { UserData, UserRegistrationData } from "../types/user"; // 从类型定义文件导入

interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<UserData>;
  logout: () => Promise<void>;
  // 使用导入的类型替换 any
  register: (
    email: string,
    password: string,
    data?: UserRegistrationData
  ) => Promise<void>;
  // 使用更明确的类型替换 any
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
  }) => Promise<void>;
  setUserAsAdmin: (uid: string) => Promise<void>;
  removeUserAdmin: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 监听身份验证状态变化
  useEffect(() => {
    setLoading(true);

    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          // 获取用户数据（包括检查和创建 Firestore 文档）
          const userData = await authService.getUserWithRole(user);
          setUserData(userData);
          setIsAdmin(userData.role === "admin");
        } catch (error) {
          console.error("Error getting user data:", error);
          setUserData(null);
          setIsAdmin(false);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }

      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // 登录用户
      const userCredential = await authService.login(email, password);
      const user = userCredential.user;

      // 获取用户资料，包括检查和创建用户文档
      const userData = await authService.getUserWithRole(user);

      // 设置用户状态
      setUserData(userData);
      setIsAdmin(userData.role === "admin");

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error : new Error("登录失败"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (
    email: string,
    password: string,
    additionalData: UserRegistrationData = {}
  ) => {
    try {
      setLoading(true);
      await authService.register(email, password, additionalData);
      // 用户数据会通过 onAuthStateChange 自动设置
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setUserData(null);
      setIsAdmin(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新用户资料
  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
  }) => {
    if (!user) throw new Error("未登录");

    try {
      setLoading(true);
      await authService.updateProfile(user.uid, data);

      // 更新本地状态
      if (userData) {
        setUserData({
          ...userData,
          ...data,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 设置用户为管理员
  const setUserAsAdmin = async (uid: string) => {
    try {
      setLoading(true);
      await authService.setAdmin(uid);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 移除管理员权限
  const removeUserAdmin = async (uid: string) => {
    try {
      setLoading(true);
      await authService.removeAdmin(uid);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userData,
    isAdmin,
    loading,
    error,
    login,
    logout,
    register,
    updateUserProfile,
    setUserAsAdmin,
    removeUserAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必须在 AuthProvider 内部使用");
  }
  return context;
};
