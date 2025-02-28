"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSetupPage() {
  const [userId, setUserId] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

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

      // 检查/创建用户文档并更新为管理员
      try {
        // 尝试从 Firestore 获取用户文档
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        // 如果用户文档不存在，则创建一个
        if (!userDoc.exists()) {
          console.log(`在 Firestore 中创建用户文档: ${userId}`);

          // 创建基本用户文档
          await setDoc(userRef, {
            uid: userId,
            role: "user", // 默认角色
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log("用户文档创建成功");
        }

        // 更新用户角色为管理员
        console.log("更新用户角色为管理员");
        await updateDoc(userRef, {
          role: "admin",
          updatedAt: new Date(),
        });

        setResult({
          success: true,
          message: `用户 ${userId} 已被设置为管理员`,
        });
      } catch (authError) {
        console.error("验证或创建用户文档失败:", authError);
        throw new Error(
          `用户操作失败: ${
            authError instanceof Error ? authError.message : String(authError)
          }`
        );
      }
    } catch (error) {
      console.error("设置管理员失败:", error);

      // 提取错误信息
      let errorMessage = "设置管理员失败";
      if (error instanceof Error) {
        errorMessage = error.message;

        // 处理 Firebase 特定错误
        if ("code" in error) {
          const fbError = error as { code: string; customData?: any };
          errorMessage = `${errorMessage} (代码: ${fbError.code})`;

          if (fbError.code === "permission-denied") {
            errorMessage += " - 请检查 Firestore 安全规则是否允许更新用户文档";
          }
        }
      }

      setResult({
        error: errorMessage,
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
      <h1 className="text-2xl font-bold mb-6">管理员设置页面</h1>

      <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded">
        <p className="font-bold">当前管理员: {user?.email || user?.uid}</p>
      </div>

      {result && (
        <div
          className={`p-4 mb-4 rounded ${
            result.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result.message || result.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            用户ID:
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            安全密钥:
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "处理中..." : "设置为管理员"}
        </button>
      </form>

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
