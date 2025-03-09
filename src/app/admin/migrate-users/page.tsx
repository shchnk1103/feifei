"use client";

import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { authService } from "@/modules/auth/services/authService";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function MigrateUsersPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAdmin } = useAuth();

  const handleMigration = async () => {
    if (!isAdmin) {
      setMessage("只有管理员可以执行迁移");
      return;
    }

    setLoading(true);
    setMessage("开始迁移用户数据...");

    try {
      // 获取所有用户 (假设用户数不多)
      // 注意：这个功能在生产环境需要通过 Firebase Admin SDK 实现
      // 这里仅用于开发环境
      const allUsers = await authService.getAllUsers();

      setMessage(`找到 ${allUsers.length} 个用户`);

      // 检查每个用户是否有 Firestore 文档
      let migratedCount = 0;

      for (const user of allUsers) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // 创建用户文档
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
            isEmailVerified: user.isEmailVerified || false,
            lastLogin: user.lastLogin || new Date(),
          });

          migratedCount++;
        }
      }

      setMessage(`迁移完成。已创建 ${migratedCount} 个用户文档。`);
    } catch (error) {
      console.error("迁移失败:", error);
      setMessage(
        `迁移失败: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">用户迁移</h1>
        <div className="bg-red-100 p-4 rounded text-red-800">
          只有管理员可以访问此页面
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">用户迁移工具</h1>

      {message && (
        <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      <button
        onClick={handleMigration}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "迁移中..." : "开始迁移用户数据"}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          此工具将检查所有 Authentication 用户，并为缺少 Firestore
          文档的用户创建文档。
        </p>
      </div>
    </div>
  );
}
