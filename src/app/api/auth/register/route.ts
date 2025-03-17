import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

export async function POST(request: Request) {
  try {
    const { email, password, ...additionalData } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 创建 Firebase 用户
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 创建用户文档
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      displayName: additionalData.displayName || email.split("@")[0],
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    });

    return NextResponse.json({ message: "注册成功" }, { status: 201 });
  } catch (error: any) {
    console.error("注册错误:", error);
    return NextResponse.json(
      { message: error.message || "注册失败" },
      { status: 500 }
    );
  }
}
