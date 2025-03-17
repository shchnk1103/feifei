import { auth, db } from "../config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  getIdToken,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserData, UserRegistrationData } from "../types/user";

/**
 * 基础认证服务
 *
 * 提供核心的用户认证功能，包括：
 * - 用户注册
 * - 用户登录
 * - 用户登出
 * - 认证状态监听
 * - Session Cookie 管理
 */
export const baseAuthService = {
  /**
   * 注册新用户
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @param additionalData - 额外的用户数据
   * @returns 创建的用户数据
   */
  async register(
    email: string,
    password: string,
    additionalData: UserRegistrationData = {}
  ): Promise<UserData> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // 创建用户数据
    const userData: UserData = {
      id: user.uid,
      email: user.email!,
      name: additionalData.name || email.split("@")[0],
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(additionalData.photoURL ? { photoURL: additionalData.photoURL } : {}),
      ...(additionalData.bio ? { bio: additionalData.bio } : {}),
    };

    // 存储用户数据到 Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    // 获取 ID token 并设置 session cookie
    const idToken = await getIdToken(user);
    await this.setSessionCookie(idToken);

    return userData;
  },

  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 登录结果
   */
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      // 获取 ID token 并设置 session cookie
      const idToken = await getIdToken(user);
      await this.setSessionCookie(idToken);

      return { user };
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    }
  },

  /**
   * 用户登出
   */
  async logout() {
    try {
      await signOut(auth);
      // 清除 session cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("登出失败:", error);
      throw error;
    }
  },

  /**
   * 监听用户认证状态变化
   * @param callback - 状态变化回调函数
   * @returns 取消监听的函数
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * 设置 session cookie
   * @param idToken - Firebase ID Token
   */
  async setSessionCookie(idToken: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("设置 session cookie 失败");
      }
    } catch (error) {
      console.error("设置 session cookie 失败:", error);
      throw error;
    }
  },
};
