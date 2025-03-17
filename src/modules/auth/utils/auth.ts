import { Session } from "next-auth";

export function isAdmin(user: Session["user"]): boolean {
  return user?.role === "admin";
}
