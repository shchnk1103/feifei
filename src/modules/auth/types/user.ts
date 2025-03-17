import { User as FirebaseUser } from "firebase/auth";
import { UserRole } from "@/types/next-auth";

/**
 * 自定义声明值的类型
 *
 * 用于定义Firebase自定义声明中可以存储的数据类型
 * 支持嵌套对象和数组，保持与JSON兼容
 */
export type CustomClaimValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: CustomClaimValue }
  | CustomClaimValue[];

/**
 * 用户注册时可提供的数据接口
 *
 * @property displayName - 用户显示名称
 * @property isAdmin - 是否将用户设置为管理员
 * @property photoURL - 用户头像URL地址
 * @property bio - 用户个人简介
 */
export interface UserRegistrationData {
  name?: string;
  bio?: string;
  photoURL?: string;
}

/**
 * 用户数据接口 - 存储在Firestore中的用户数据结构
 *
 * @property uid - 用户唯一标识符，来自Firebase Auth
 * @property email - 用户电子邮件地址
 * @property displayName - 用户显示名称，可选
 * @property photoURL - 用户头像URL，可选
 * @property createdAt - 用户账号创建时间
 * @property role - 用户角色，可以是普通用户或管理员
 * @property isEmailVerified - 用户邮箱是否已验证
 * @property lastLogin - 用户最后登录时间
 * @property bio - 用户个人简介，可选
 * @property customClaims - 自定义声明对象，用于存储额外的用户数据
 * @property updatedAt - 用户数据最后更新时间，可选
 */
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  displayName?: string;
  bio?: string;
  photoURL?: string;
  lastLogin?: Date;
  isEmailVerified?: boolean;
  uid?: string;
}

/**
 * 集成的用户信息类型
 *
 * 结合了Firebase Auth用户对象和Firestore中存储的用户数据
 *
 * @property firebaseUser - Firebase Authentication用户对象，可能为null（未登录）
 * @property userData - 来自Firestore的扩展用户数据，可能为null（未获取或不存在）
 */
export interface UserInfo {
  firebaseUser: FirebaseUser | null;
  userData: UserData | null;
}

/**
 * 检查用户是否具有管理员权限
 *
 * @param userInfo - 用户信息对象
 * @returns 如果用户是管理员则返回true，否则返回false
 */
export function isAdmin(userInfo: UserInfo): boolean {
  return Boolean(userInfo.userData?.role === "admin");
}

/**
 * 获取用户显示名称
 *
 * 按以下优先级获取用户名称：
 * 1. 自定义用户数据中的displayName
 * 2. Firebase用户对象中的displayName
 * 3. 从电子邮件中提取用户名部分
 * 4. 使用用户ID的一部分
 *
 * @param userInfo - 用户信息对象
 * @returns 用户的显示名称，如果用户未登录则返回空字符串
 */
export function getUserDisplayName(userInfo: UserInfo): string {
  const { firebaseUser, userData } = userInfo;

  if (!firebaseUser) return "";

  if (userData?.name) return userData.name;
  if (firebaseUser.displayName) return firebaseUser.displayName;

  if (firebaseUser.email) {
    const emailParts = firebaseUser.email.split("@");
    return emailParts[0] || "";
  }

  return firebaseUser.uid.substring(0, 8);
}

/**
 * 获取用户头像URL
 *
 * 按以下优先级获取用户头像：
 * 1. 自定义用户数据中的photoURL
 * 2. Firebase用户对象中的photoURL
 * 3. 默认头像
 *
 * @param userInfo - 用户信息对象
 * @returns 用户的头像URL，如果没有则返回默认头像URL
 */
export function getUserAvatar(userInfo: UserInfo): string {
  const { firebaseUser, userData } = userInfo;

  if (!firebaseUser) return "/images/default-avatar.png";

  if (userData?.photoURL) return userData.photoURL;
  if (firebaseUser.photoURL) return firebaseUser.photoURL;

  return "/images/default-avatar.png";
}

/**
 * 检查用户是否已登录
 *
 * @param userInfo - 用户信息对象
 * @returns 用户是否已登录
 */
export function isUserLoggedIn(userInfo: UserInfo): boolean {
  return Boolean(userInfo.firebaseUser);
}
