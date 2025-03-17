"use client";

import { useState } from "react";
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
      const response = await fetch("/api/auth/migrate-users", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "迁移失败");
      }

      const result = await response.json();
      setMessage(result.message);
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
