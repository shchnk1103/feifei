"use client";

import { useAuth } from "./useAuth";
import {
  UserInfo,
  isAdmin,
  getUserDisplayName,
  getUserAvatar,
  UserData,
} from "../types/user";
import { User } from "firebase/auth";

export function useUserInfo() {
  const { user } = useAuth();

  const userInfo: UserInfo = {
    firebaseUser: user as User | null,
    userData: user
      ? ({
          id: user.uid,
          email: user.email || "",
          name: user.name || user.email?.split("@")[0] || "",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          isEmailVerified: false,
          uid: user.uid,
        } as UserData)
      : null,
  };

  return {
    userInfo,
    isAdmin: isAdmin(userInfo),
    displayName: getUserDisplayName(userInfo),
    avatar: getUserAvatar(userInfo),
    isLoggedIn: Boolean(user),
  };
}
