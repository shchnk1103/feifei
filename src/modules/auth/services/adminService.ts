import { auth, db } from "../config";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
import type { UserRole } from "@/types/next-auth";
import { UserData } from "../types/user";

/**
 * 管理员服务
 *
 * 提供管理员相关的功能，包括：
 * - 管理员权限检查
 * - 设置/移除管理员权限
 * - 获取用户列表
 * - 用户数据管理
 */
export const adminService = {
  /**
   * 检查用户是否为管理员
   * @param role - 用户角色
   * @returns 是否为管理员
   */
  isAdmin(role?: UserRole): boolean {
    return role === "admin";
  },

  /**
   * 设置用户为管理员
   * @param uid - 目标用户ID
   */
  async setAdmin(uid: string): Promise<void> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能执行此操作");
    }

    // 检查当前用户是否为管理员
    const currentUserData = await this.getUserData(currentUser.uid);
    if (!currentUserData || !this.isAdmin(currentUserData.role)) {
      throw new Error("只有管理员可以设置其他用户为管理员");
    }

    // 设置目标用户为管理员
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "admin",
      updatedAt: new Date(),
    });
  },

  /**
   * 将管理员降级为普通用户
   * @param uid - 目标用户ID
   */
  async removeAdmin(uid: string): Promise<void> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能执行此操作");
    }

    // 检查当前用户是否为管理员
    const currentUserData = await this.getUserData(currentUser.uid);
    if (!currentUserData || !this.isAdmin(currentUserData.role)) {
      throw new Error("只有管理员可以移除管理员权限");
    }

    // 防止自我降级
    if (currentUser.uid === uid) {
      throw new Error("您不能移除自己的管理员权限");
    }

    // 将目标用户设为普通用户
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "user",
      updatedAt: new Date(),
    });
  },

  /**
   * 获取所有用户列表（仅管理员可用）
   * @returns 用户列表
   */
  async getAllUsers(): Promise<UserData[]> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能查看用户列表");
    }

    // 检查是否为管理员
    const currentUserData = await this.getUserData(currentUser.uid);
    if (!currentUserData || !this.isAdmin(currentUserData.role)) {
      throw new Error("只有管理员可以查看用户列表");
    }

    // 获取所有用户
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    return usersSnapshot.docs.map((doc) => doc.data() as UserData);
  },

  /**
   * 获取用户数据
   * @param uid - 用户ID
   * @returns 用户数据
   */
  async getUserData(uid: string): Promise<UserData | null> {
    if (!uid) return null;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }

    return null;
  },

  /**
   * 获取用户完整资料与角色
   * @param user - Firebase 用户对象
   * @returns 用户完整数据
   */
  async getUserWithRole(user: User): Promise<UserData> {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        const basicUserData: UserData = {
          id: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split("@")[0],
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          ...(user.photoURL ? { photoURL: user.photoURL } : {}),
        };

        await setDoc(userDocRef, basicUserData);
        return basicUserData;
      }
    } catch (error) {
      console.error("获取用户数据失败:", error);
      return {
        id: user.uid,
        email: user.email!,
        name: user.displayName || user.email!.split("@")[0],
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(user.photoURL ? { photoURL: user.photoURL } : {}),
      };
    }
  },
};
