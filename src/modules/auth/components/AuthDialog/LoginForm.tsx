"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { logger } from "@/lib/logger";
import styles from "./styles.module.css";

interface LoginFormProps {
  onClose: () => void;
}

// 定义错误类型
interface AuthError extends Error {
  code?: string;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    logger.info("开始登录流程", { email });

    try {
      await login(email, password);
      logger.info("登录成功，准备关闭对话框");
      onClose();
    } catch (err: unknown) {
      // 利用错误信息提供更具体的错误提示
      let errorMessage = "登录失败，请检查邮箱和密码";

      if (err instanceof Error) {
        // 检查是否是 Firebase Auth 错误
        const authError = err as AuthError;

        // 根据错误代码提供更具体的错误信息
        if (authError.code) {
          switch (authError.code) {
            case "auth/user-not-found":
              errorMessage = "用户不存在，请检查邮箱或注册新账号";
              break;
            case "auth/wrong-password":
              errorMessage = "密码错误，请重新输入";
              break;
            case "auth/invalid-credential":
              errorMessage = "登录凭证无效，请检查邮箱和密码";
              break;
            case "auth/too-many-requests":
              errorMessage = "登录尝试次数过多，请稍后再试";
              break;
            case "auth/user-disabled":
              errorMessage = "该账号已被禁用，请联系管理员";
              break;
            case "auth/invalid-email":
              errorMessage = "邮箱格式不正确";
              break;
          }
        }

        logger.error("登录失败", {
          error: err,
          code: authError.code,
          message: errorMessage,
        });
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          required
          className={styles.input}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          className={styles.input}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
