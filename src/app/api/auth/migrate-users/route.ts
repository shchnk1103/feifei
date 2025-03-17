import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { RouteHandlerParams } from "@/types/next-api";
import { getAuth } from "firebase-admin/auth";

type Params = Promise<{}>;

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    // 检查当前用户是否为管理员
    const currentUserDoc = await db
      .collection("users")
      .doc(session.user.id)
      .get();
    if (currentUserDoc.data()?.role !== "admin") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }

    // 获取所有用户
    const usersSnapshot = await db.collection("users").get();
    const existingUserIds = new Set(usersSnapshot.docs.map((doc) => doc.id));

    // 获取所有 Authentication 用户
    const auth = getAuth();
    const authUsers = await auth.listUsers();
    let migratedCount = 0;

    // 为每个缺少文档的用户创建文档
    for (const user of authUsers.users) {
      if (!existingUserIds.has(user.uid)) {
        await db
          .collection("users")
          .doc(user.uid)
          .set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
            isEmailVerified: user.emailVerified || false,
            lastLogin: user.metadata.lastSignInTime
              ? new Date(user.metadata.lastSignInTime)
              : new Date(),
          });
        migratedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount,
      message: `成功创建 ${migratedCount} 个用户文档`,
    });
  } catch (error) {
    console.error("用户迁移失败:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "用户迁移失败" },
      { status: 500 }
    );
  }
}
