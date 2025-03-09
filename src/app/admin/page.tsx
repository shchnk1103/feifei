"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { updateUserRole } from "../actions/admin";

// 定义结果状态的接口
interface ResultState {
  success?: boolean;
  error?: string;
  message?: string;
}

export default function AdminSetupPage() {
  const [userId, setUserId] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);

  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // 检查用户权限并重定向
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // 用户未登录，重定向到登录页面
        router.push("/login");
      } else if (!isAdmin) {
        // 用户不是管理员，重定向到首页
        router.push("/");
      }
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 验证密钥
      const expectedSecret = "d8e7f6g5h4j3k2l1m0n9o8p7q6";
      if (secret !== expectedSecret) {
        throw new Error("密钥不正确");
      }

      // 检查用户ID
      if (!userId) {
        throw new Error("请输入用户ID");
      }

      // 使用 Server Action 更新用户角色
      const result = await updateUserRole(userId, "admin");

      if (result.error) {
        throw new Error(result.error);
      }

      setResult({
        success: true,
        message: `用户 ${userId} 已被设置为管理员`,
      });
    } catch (error) {
      console.error("设置管理员失败:", error);
      setResult({
        error: error instanceof Error ? error.message : "设置管理员失败",
      });
    } finally {
      setLoading(false);
    }
  };

  // 显示加载状态
  if (authLoading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-500">正在验证管理员权限...</p>
      </div>
    );
  }

  // 如果不是管理员或未登录，什么都不渲染（useEffect 会处理重定向）
  if (!user || !isAdmin) {
    return null;
  }

  // 管理员页面内容
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">设置管理员</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            用户ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="输入用户ID"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            安全密钥
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="输入安全密钥"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "处理中..." : "设置管理员"}
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded ${
            result.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {result.success ? result.message : result.error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>注意: 此方法直接在客户端执行，仅适用于开发环境</p>
        <p className="mt-2">要设置管理员，请输入:</p>
        <ol className="list-decimal pl-5">
          <li>用户ID - 可在 Firebase 控制台 Authentication 中找到</li>
          <li>
            安全密钥 - <strong>d8e7f6g5h4j3k2l1m0n9o8p7q6</strong>
          </li>
        </ol>
      </div>
    </div>
  );
}
