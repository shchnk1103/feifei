import { useAuth } from "@/contexts/AuthContext";
import {
  UserInfo,
  isAdmin,
  getUserDisplayName,
  getUserAvatar,
} from "@/types/user";

export function useUserInfo() {
  const { user, userData } = useAuth();

  const userInfo: UserInfo = {
    firebaseUser: user,
    userData,
  };

  return {
    userInfo,
    isAdmin: isAdmin(userInfo),
    displayName: getUserDisplayName(userInfo),
    avatar: getUserAvatar(userInfo),
    isLoggedIn: Boolean(user),
  };
}
