import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
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

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name:
              userData.displayName ||
              userCredential.user.displayName ||
              userCredential.user.email.split("@")[0],
            role: userData.role || "user",
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString(),
          };
        } catch (error: any) {
          console.error("认证错误:", error);

          // 处理 Firebase 认证错误
          switch (error.code) {
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
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
