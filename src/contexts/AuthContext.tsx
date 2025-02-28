"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { authService } from "@/lib/firebase/services/authService";

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, data?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          // 获取用户数据，包括角色信息
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as UserData;
            setUserData(userData);
            // 明确检查并设置 isAdmin 状态
            setIsAdmin(userData.role === "admin");
            console.log(
              "用户角色:",
              userData.role,
              "isAdmin:",
              userData.role === "admin"
            );
          } else {
            setUserData(null);
            setIsAdmin(false);
            console.log("用户文档不存在");
          }
        } else {
          setUserData(null);
          setIsAdmin(false);
          console.log("用户未登录");
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

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // 登录用户
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 获取用户数据
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        setUserData(userData);
        // 明确设置 isAdmin 状态
        setIsAdmin(userData.role === "admin");
        console.log(
          "登录用户角色:",
          userData.role,
          "isAdmin:",
          userData.role === "admin"
        );
      } else {
        setUserData(null);
        setIsAdmin(false);
      }

      return user;
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error : new Error("登录失败"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, data?: any) => {
    try {
      await authService.register(email, password, data);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // 添加清除用户状态的代码
      setUser(null);
      setUserData(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
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
  return context;
}
