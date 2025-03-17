import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const data = await request.json();
    const { displayName, photoURL, bio } = data;

    // 更新用户文档
    await updateDoc(doc(db, "users", session.user.id), {
      displayName,
      photoURL,
      bio,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "更新成功" }, { status: 200 });
  } catch (error: any) {
    console.error("更新资料错误:", error);
    return NextResponse.json(
      { message: error.message || "更新失败" },
      { status: 500 }
    );
  }
}
