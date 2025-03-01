"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { authService } from "@/lib/firebase/services/authService";
// 添加 UserInfo 到导入列表中
import { UserData, UserRegistrationData } from "@/types/user";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<User | null>;
  // 使用从 user.ts 导入的类型
  register: (
    email: string,
    password: string,
    data?: UserRegistrationData
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 监听认证状态变化并获取用户数据
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          // 使用 authService 获取完整用户数据
          const fullUserData = await authService.getUserData(currentUser.uid);
          setUserData(fullUserData);
          setIsAdmin(Boolean(fullUserData?.role === "admin"));
        } else {
          setUserData(null);
          setIsAdmin(false);
        }
        setUser(currentUser);
      } catch (err) {
        console.error("获取用户数据失败:", err);
        setUserData(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 登录函数
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      setError(null);
      setLoading(true);

      // 使用 authService 进行登录
      const userCredential = await authService.login(email, password);
      const user = userCredential.user;

      // 获取用户完整数据
      const fullUserData = await authService.getUserData(user.uid);
      setUserData(fullUserData);
      setIsAdmin(Boolean(fullUserData?.role === "admin"));

      return user;
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error : new Error("登录失败"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 注册函数 - 使用具体类型
  const register = async (
    email: string,
    password: string,
    data?: UserRegistrationData
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.register(email, password, data);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("注册失败"));
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      // 清除用户状态
      setUser(null);
      setUserData(null);
      setIsAdmin(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("登出失败"));
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    userData,
    isAdmin,
    loading,
    error,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // 不再返回 userInfo
}
