import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./styles.module.css";

interface RegisterFormProps {
  onClose: () => void;
}

// 定义 Firebase Auth 错误类型
interface AuthError extends Error {
  code?: string;
}

export function RegisterForm({ onClose }: RegisterFormProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      onClose();
    } catch (err: unknown) {
      // 提供默认错误信息
      let errorMessage = "注册失败，请稍后重试";

      if (err instanceof Error) {
        const authError = err as AuthError;

        // 根据错误代码提供更具体的错误信息
        if (authError.code) {
          switch (authError.code) {
            case "auth/email-already-in-use":
              errorMessage = "该邮箱已被注册";
              break;
            case "auth/invalid-email":
              errorMessage = "无效的邮箱格式";
              break;
            case "auth/weak-password":
              errorMessage = "密码强度太弱，请使用更复杂的密码";
              break;
            case "auth/operation-not-allowed":
              errorMessage = "邮箱/密码注册未启用，请联系管理员";
              break;
            case "auth/network-request-failed":
              errorMessage = "网络连接失败，请检查您的网络";
              break;
          }
        }

        // 记录错误到控制台，便于调试
        console.error("注册错误:", authError);
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
      <div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="确认密码"
          required
          className={styles.input}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "注册中..." : "注册"}
      </button>
    </form>
  );
}
