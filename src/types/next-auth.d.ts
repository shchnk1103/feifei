import "next-auth";
import { DefaultSession } from "next-auth";

// 定义用户角色类型
export type UserRole = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      createdAt: number;
      updatedAt: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    createdAt: number;
    updatedAt: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    createdAt: number;
    updatedAt: number;
  }
}
