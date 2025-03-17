import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NextRequest } from "next/server";
import { RouteHandlerParams } from "@/types/next-api";

type Params = Promise<{ uid: string }>;

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const { uid } = await segmentData.params;

  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    // 检查当前用户是否为管理员
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    if (currentUserDoc.data()?.role !== "admin") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }

    // 更新用户角色为管理员
    await updateDoc(doc(db, "users", uid), {
      role: "admin",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "设置成功" }, { status: 200 });
  } catch (error: any) {
    console.error("设置管理员错误:", error);
    return NextResponse.json(
      { message: error.message || "设置失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const { uid } = await segmentData.params;

  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    // 检查当前用户是否为管理员
    const currentUserDoc = await getDoc(doc(db, "users", session.user.id));
    if (currentUserDoc.data()?.role !== "admin") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }

    // 更新用户角色为普通用户
    await updateDoc(doc(db, "users", uid), {
      role: "user",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "移除成功" }, { status: 200 });
  } catch (error: any) {
    console.error("移除管理员错误:", error);
    return NextResponse.json(
      { message: error.message || "移除失败" },
      { status: 500 }
    );
  }
}
