import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { UserRole } from "@/types/next-auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        console.log("NextAuth开始认证", {
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password,
        });
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请输入邮箱和密码");
        }

        try {
          // 使用 Firebase 进行认证
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          if (!userCredential.user.email) {
            throw new Error("用户邮箱不存在");
          }

          // 获取用户额外信息
          const userDoc = await getDoc(
            doc(db, "users", userCredential.user.uid)
          );
          const userData = userDoc.data();

          if (!userData) {
            throw new Error("用户数据不存在");
          }

          const now = Date.now();

          // 处理可能是字符串或Firestore时间戳的日期
          let createdAt = now;
          let updatedAt = now;

          if (userData.createdAt) {
            if (typeof userData.createdAt === "string") {
              // 如果是ISO字符串格式
              createdAt = new Date(userData.createdAt).getTime();
            } else if (typeof userData.createdAt.toMillis === "function") {
              // 如果是Firestore时间戳
              createdAt = userData.createdAt.toMillis();
            } else if (userData.createdAt.seconds) {
              // 如果是Firestore时间戳对象但没有toMillis方法
              createdAt = userData.createdAt.seconds * 1000;
            }
          }

          if (userData.updatedAt) {
            if (typeof userData.updatedAt === "string") {
              // 如果是ISO字符串格式
              updatedAt = new Date(userData.updatedAt).getTime();
            } else if (typeof userData.updatedAt.toMillis === "function") {
              // 如果是Firestore时间戳
              updatedAt = userData.updatedAt.toMillis();
            } else if (userData.updatedAt.seconds) {
              // 如果是Firestore时间戳对象但没有toMillis方法
              updatedAt = userData.updatedAt.seconds * 1000;
            }
          }

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name:
              userData.displayName ||
              userCredential.user.displayName ||
              userCredential.user.email.split("@")[0],
            role: (userData.role as UserRole) || "user",
            createdAt,
            updatedAt,
          };
        } catch (error: unknown) {
          console.error("NextAuth认证错误:", error, {
            code:
              error instanceof Error && "code" in error
                ? (error as { code: string }).code
                : "unknown",
            message: error instanceof Error ? error.message : String(error),
          });

          // 处理 Firebase 认证错误
          if (error instanceof Error && "code" in error) {
            const firebaseError = error as { code: string };
            switch (firebaseError.code) {
              case "auth/user-not-found":
                throw new Error("用户不存在");
              case "auth/wrong-password":
                throw new Error("密码错误");
              case "auth/invalid-email":
                throw new Error("邮箱格式不正确");
              case "auth/user-disabled":
                throw new Error("账号已被禁用");
              case "auth/too-many-requests":
                throw new Error("登录尝试次数过多，请稍后再试");
              default:
                throw new Error("登录失败，请检查邮箱和密码");
            }
          }
          throw new Error("登录失败，请检查邮箱和密码");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 将所有用户信息保存到 token 中
        token.id = user.id;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // 从 token 中恢复所有用户信息到 session
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
