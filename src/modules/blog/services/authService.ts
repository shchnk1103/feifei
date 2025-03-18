import { ArticleError } from "../errors/ArticleError";

interface Session {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

export const authService = {
  /**
   * 获取认证令牌
   * @returns {Promise<string>} 认证令牌
   */
  async getAuthToken(): Promise<string> {
    try {
      const session = await this.getSession();
      return session?.token || "";
    } catch (error) {
      console.error("获取认证令牌失败:", error);
      throw new ArticleError("获取认证失败", "AUTH_ERROR");
    }
  },

  /**
   * 获取会话信息
   * @returns {Promise<Session>} 会话信息
   */
  async getSession(): Promise<Session> {
    try {
      const response = await fetch("/api/auth/session");
      return await response.json();
    } catch (error) {
      console.error("获取会话信息失败:", error);
      throw new ArticleError("获取会话信息失败", "AUTH_ERROR");
    }
  },
};
