import { cookies } from "next/headers";
import { auth } from "./firebase-admin";
import { redirect } from "next/navigation";

export interface AuthUser {
  uid: string;
  email: string;
  role?: string;
}

// 定义角色类型
export type UserRole = "user" | "admin";

// 定义错误类型
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * 验证用户会话的包装器函数
 * 用于包装 Server Actions 和 API Routes
 */
export async function withAuth<T>(
  handler: (user: AuthUser) => Promise<T>
): Promise<T> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session);
    const user: AuthUser = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || "",
      role: decodedClaims.role,
    };

    return await handler(user);
  } catch (error) {
    console.error("Session verification failed:", error);
    redirect("/login");
  }
}

/**
 * 验证用户是否为管理员的包装器函数
 */
export async function withAdmin<T>(
  handler: (user: AuthUser) => Promise<T>
): Promise<T> {
  return withAuth(async (user) => {
    if (user.role !== "admin") {
      throw new AuthorizationError("需要管理员权限");
    }
    return handler(user);
  });
}

/**
 * 验证用户是否具有特定角色的包装器函数
 */
export async function withRole<T>(
  role: UserRole,
  handler: (user: AuthUser) => Promise<T>
): Promise<T> {
  return withAuth(async (user) => {
    if (user.role !== role) {
      throw new AuthorizationError(`需要 ${role} 权限`);
    }
    return handler(user);
  });
}

/**
 * 检查用户是否有权限访问特定资源
 * 例如：检查用户是否可以编辑特定文档
 */
export async function checkPermission(
  userId: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  // 根据不同操作类型进行权限检查
  switch (action) {
    case "edit":
      return userId === resourceId;
    case "view":
      return true; // 假设所有人都可以查看
    case "delete":
      return userId === resourceId;
    default:
      return false;
  }
}
