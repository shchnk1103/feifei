import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { logger } from "@/lib/logger";
interface FirebaseError extends Error {
  code?: string;
}
export async function POST(request: Request) {
  try {
    logger.info("开始处理注册请求");
    const { email, password, ...additionalData } = await request.json();

    logger.info("收到注册数据", {
      hasEmail: !!email,
      passwordLength: password?.length,
    });
    if (!email || !password) {
      logger.warn("注册失败：邮箱或密码为空");
      return NextResponse.json(
        { message: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    logger.info("尝试创建Firebase用户");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    logger.info("Firebase用户创建成功", { uid: userCredential.user.uid });
    const userData = {
      email,
      displayName: additionalData.name || email.split("@")[0],
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    logger.info("开始创建用户文档");
    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    logger.info("用户注册完成");
    return NextResponse.json({ message: "注册成功" }, { status: 201 });
  } catch (error: unknown) {
    const err = error as FirebaseError;
    const errorCode = err.code || "unknown";

    logger.error("注册过程中发生错误", {
      code: errorCode,
      message: err.message,
    });
    return NextResponse.json(
      { message: err.message || "注册失败" },
      { status: 500 }
    );
  }
}
