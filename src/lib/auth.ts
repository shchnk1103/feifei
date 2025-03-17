import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@/types/next-auth";
import { db } from "@/lib/firebase/admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

// 检查必要的环境变量
const requiredEnvVars = [
  "NEXTAUTH_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
] as const;

// 确保所有必需的环境变量都存在
const envVars = {} as Record<(typeof requiredEnvVars)[number], string>;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`缺少必需的环境变量: ${envVar}`);
  }
  envVars[envVar] = value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 使用 Firebase Auth 进行认证
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          // 从 Firestore 获取用户数据
          const userDoc = await db
            .collection("users")
            .doc(userCredential.user.uid)
            .get();

          if (!userDoc.exists) {
            console.error("用户数据不存在");
            return null;
          }

          const userData = userDoc.data();

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email || "",
            name: userData?.name || userCredential.user.displayName || "",
            role: userData?.role || "user",
            createdAt: userData?.createdAt?.toDate() || new Date(),
            updatedAt: userData?.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("认证失败:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.createdAt = user.createdAt.getTime();
        token.updatedAt = user.updatedAt.getTime();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.createdAt = new Date(token.createdAt);
        session.user.updatedAt = new Date(token.updatedAt);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: envVars.NEXTAUTH_SECRET,
};

// 获取服务器端会话
export const getServerAuthSession = () => getServerSession(authOptions);

// 定义错误类型
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * 验证用户是否具有特定角色的包装器函数
 */
export async function withRole<T>(
  role: UserRole,
  handler: (
    session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>
  ) => Promise<T>
): Promise<T> {
  const session = await getServerAuthSession();

  if (!session?.user) {
    throw new AuthorizationError("未登录");
  }

  if (session.user.role !== role) {
    throw new AuthorizationError(`需要 ${role} 权限`);
  }

  return handler(session);
}

/**
 * 验证用户是否为管理员的包装器函数
 */
export async function withAdmin<T>(
  handler: (
    session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>
  ) => Promise<T>
): Promise<T> {
  return withRole("admin", handler);
}

/**
 * 检查用户是否有权限访问特定资源
 */
export async function checkPermission(
  userId: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  switch (action) {
    case "edit":
      return userId === resourceId;
    case "view":
      return true;
    case "delete":
      return userId === resourceId;
    default:
      return false;
  }
}
