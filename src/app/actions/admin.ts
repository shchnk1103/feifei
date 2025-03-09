"use server";

import { db } from "../../lib/firebase-admin";
import { withAdmin, AuthorizationError } from "../../lib/auth";
import { revalidatePath } from "next/cache";

interface UserUpdateData {
  role?: "user" | "admin";
  isActive?: boolean;
  notes?: string;
}

/**
 * 更新用户角色（仅管理员可用）
 */
export async function updateUserRole(userId: string, role: "user" | "admin") {
  return withAdmin(async (adminUser) => {
    try {
      // 防止管理员降级自己的权限
      if (userId === adminUser.uid) {
        throw new AuthorizationError("不能修改自己的管理员权限");
      }

      // 更新用户数据
      await db.collection("users").doc(userId).update({
        role,
        updatedAt: new Date(),
        updatedBy: adminUser.uid,
      });

      // 重新验证用户列表页面
      revalidatePath("/admin/users");

      return { success: true };
    } catch (error) {
      console.error("更新用户角色失败:", error);
      if (error instanceof AuthorizationError) {
        return { error: error.message };
      }
      return {
        error: error instanceof Error ? error.message : "更新用户角色失败",
      };
    }
  });
}

/**
 * 获取所有用户列表（仅管理员可用）
 */
export async function getAllUsers() {
  return withAdmin(async () => {
    try {
      const usersSnapshot = await db.collection("users").get();
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, users };
    } catch (error) {
      console.error("获取用户列表失败:", error);
      return {
        error: error instanceof Error ? error.message : "获取用户列表失败",
      };
    }
  });
}

/**
 * 更新用户状态（仅管理员可用）
 */
export async function updateUserStatus(userId: string, data: UserUpdateData) {
  return withAdmin(async (adminUser) => {
    try {
      // 防止管理员修改自己的状态
      if (userId === adminUser.uid) {
        throw new AuthorizationError("不能修改自己的状态");
      }

      // 更新用户数据
      await db
        .collection("users")
        .doc(userId)
        .update({
          ...data,
          updatedAt: new Date(),
          updatedBy: adminUser.uid,
        });

      // 重新验证用户列表页面
      revalidatePath("/admin/users");

      return { success: true };
    } catch (error) {
      console.error("更新用户状态失败:", error);
      if (error instanceof AuthorizationError) {
        return { error: error.message };
      }
      return {
        error: error instanceof Error ? error.message : "更新用户状态失败",
      };
    }
  });
}
