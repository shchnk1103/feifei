import { baseAuthService } from "./baseAuthService";
import { userProfileService } from "./userProfileService";
import { adminService } from "./adminService";
import { signOut } from "next-auth/react";

/**
 * 认证服务
 *
 * 整合所有认证相关的功能，包括：
 * - 基础认证功能（注册、登录、登出等）
 * - 用户资料管理
 * - 管理员功能
 */
export const authService = {
  ...baseAuthService,
  ...userProfileService,
  ...adminService,
  async logout() {
    await signOut({ callbackUrl: "/" });
  },
};
