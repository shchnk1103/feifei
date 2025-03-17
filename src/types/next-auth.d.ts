import type { DefaultSession } from "next-auth";

// 定义用户角色类型
export type UserRole = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: number;
    updatedAt: number;
  }
}
