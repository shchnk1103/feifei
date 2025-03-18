import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@/types/next-auth";
import { db } from "@/lib/firebase/admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { logger } from "@/lib/logger";

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
          logger.warn("认证失败：缺少邮箱或密码");
          return null;
        }

        try {
          logger.info("开始认证流程", { email: credentials.email });

          // 使用 Firebase Auth 进行认证
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          logger.info("Firebase Auth 认证成功", {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
          });

          // 从 Firestore 获取用户数据
          const userDoc = await db
            .collection("users")
            .doc(userCredential.user.uid)
            .get();

          if (!userDoc.exists) {
            logger.info("用户数据不存在，创建新用户数据", {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            });

            // 如果用户数据不存在，创建一个新的用户文档
            const now = Date.now();
            const newUser = {
              email: userCredential.user.email,
              name:
                userCredential.user.displayName ||
                credentials.email.split("@")[0],
              role: "user" as UserRole,
              createdAt: now,
              updatedAt: now,
            };

            await db
              .collection("users")
              .doc(userCredential.user.uid)
              .set(newUser);

            logger.info("新用户数据创建成功", {
              uid: userCredential.user.uid,
              ...newUser,
            });

            return {
              id: userCredential.user.uid,
              ...newUser,
            };
          }

          const userData = userDoc.data();
          logger.debug("获取到的用户数据", {
            uid: userCredential.user.uid,
            userData,
          });

          const now = Date.now();
          const user = {
            id: userCredential.user.uid,
            email: userCredential.user.email || "",
            name: userData?.name || userCredential.user.displayName || "",
            role: (userData?.role as UserRole) || "user",
            createdAt: userData?.createdAt?.toMillis() || now,
            updatedAt: userData?.updatedAt?.toMillis() || now,
          };

          logger.info("用户认证成功", { user });
          return user;
        } catch (error) {
          logger.error("认证失败", error);
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
        logger.debug("JWT 回调 - 用户数据", { user });

        // 确保所有用户数据都被复制到 token 中
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;

        logger.debug("JWT 回调 - 更新后的 token", { token });
      }
      return token;
    },
    async session({ session, token }) {
      logger.debug("Session 回调 - token", { token });

      // 确保 session.user 存在
      if (!session.user) {
        const now = Date.now();
        session.user = {
          id: "",
          name: "",
          email: "",
          role: "user" as UserRole,
          createdAt: now,
          updatedAt: now,
        };
      }

      // 从 token 复制所有用户数据到 session
      session.user.id = token.id;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.role = token.role;
      session.user.createdAt = token.createdAt;
      session.user.updatedAt = token.updatedAt;

      logger.debug("Session 回调 - 更新后的 session", { session });
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
