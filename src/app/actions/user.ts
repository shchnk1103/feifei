"use server";

import { db } from "../../lib/firebase-admin";
import { withAuth } from "../../lib/auth";
import { revalidatePath } from "next/cache";

interface UpdateProfileData {
  displayName: string;
  bio: string;
  photoURL?: string;
}

export async function updateUserProfile(data: UpdateProfileData) {
  return withAuth(async (user) => {
    try {
      // 更新用户数据
      const updateData = {
        displayName: data.displayName,
        bio: data.bio,
        updatedAt: new Date(),
        ...(data.photoURL && { photoURL: data.photoURL }),
      };

      // 更新Firestore中的用户数据
      await db.collection("users").doc(user.uid).update(updateData);

      // 重新验证页面数据
      revalidatePath("/profile/[username]");

      return { success: true };
    } catch (error) {
      console.error("更新用户资料失败:", error);
      return {
        error: error instanceof Error ? error.message : "更新用户资料失败",
      };
    }
  });
}
