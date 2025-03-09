import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "success" });

  // 清除 session cookie
  response.cookies.delete("session");

  return response;
}
