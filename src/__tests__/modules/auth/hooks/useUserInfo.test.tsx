import "@testing-library/jest-dom"; // 添加 jest-dom 匹配器
import { renderHook } from "@testing-library/react";
import { useUserInfo } from "@/modules/auth/hooks/useUserInfo";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { User } from "firebase/auth";
import { UserData } from "@/modules/auth/types/user";

// Mock useAuth hook
jest.mock("@/modules/auth/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("useUserInfo", () => {
  // 每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("返回正确的用户信息，用户已登录", () => {
    // 创建模拟的 Firebase User 和 UserData
    const mockUser: Partial<User> = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Firebase User",
      emailVerified: true,
      photoURL: "https://example.com/firebase-photo.jpg",
    };

    const mockUserData: UserData = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Custom User",
      role: "user",
      createdAt: new Date(),
      photoURL: "https://example.com/custom-photo.jpg",
    };

    // 设置 useAuth 的模拟返回值
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      isAdmin: false,
    });

    const { result } = renderHook(() => useUserInfo());

    // 验证返回值
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.displayName).toBe("Custom User"); // userData 的名称优先
    expect(result.current.avatar).toBe("https://example.com/custom-photo.jpg"); // userData 的照片优先
    expect(result.current.userInfo).toEqual({
      firebaseUser: mockUser,
      userData: mockUserData,
    });
  });

  test("当 userData 没有 displayName 时应使用 firebaseUser 的 displayName", () => {
    // 创建模拟数据，userData 没有 displayName
    const mockUser: Partial<User> = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Firebase User", // 只在 Firebase 用户中有名字
      photoURL: null,
    };

    const mockUserData: UserData = {
      uid: "test-uid",
      email: "test@example.com",
      role: "user",
      createdAt: new Date(),
      // 没有 displayName
    };

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      isAdmin: false,
    });

    const { result } = renderHook(() => useUserInfo());

    expect(result.current.displayName).toBe("Firebase User");
  });

  test("当没有 displayName 时应从 email 中提取", () => {
    // 创建模拟数据，没有任何 displayName
    const mockUser: Partial<User> = {
      uid: "test-uid",
      email: "john.doe@example.com",
      photoURL: null,
      // 没有 displayName
    };

    const mockUserData: UserData = {
      uid: "test-uid",
      email: "john.doe@example.com",
      role: "user",
      createdAt: new Date(),
      // 没有 displayName
    };

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      isAdmin: false,
    });

    const { result } = renderHook(() => useUserInfo());

    expect(result.current.displayName).toBe("john.doe");
  });

  test("返回正确的用户信息，用户未登录", () => {
    // 设置 useAuth 的模拟返回值表示未登录状态
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      userData: null,
      isAdmin: false,
    });

    const { result } = renderHook(() => useUserInfo());

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.displayName).toBe(""); // 未登录时返回空字符串
    expect(result.current.avatar).toBe("/images/default-avatar.png"); // 未登录时返回默认头像
    expect(result.current.userInfo).toEqual({
      firebaseUser: null,
      userData: null,
    });
  });

  test("管理员用户显示正确标识", () => {
    // 设置 useAuth 的模拟返回值表示管理员用户
    const adminUser: Partial<User> = { uid: "admin-uid" };
    const adminUserData: UserData = {
      uid: "admin-uid",
      email: "admin@example.com",
      role: "admin", // 管理员角色
      createdAt: new Date(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      user: adminUser,
      userData: adminUserData,
      isAdmin: true, // AuthContext 已设置 isAdmin 标志
    });

    const { result } = renderHook(() => useUserInfo());

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.userInfo.userData?.role).toBe("admin");
  });

  test("处理头像优先级：userData > firebaseUser > 默认", () => {
    // 1. 只有 Firebase 用户的头像
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user1", photoURL: "firebase-avatar.jpg" },
      userData: {
        uid: "user1",
        email: "user1@example.com",
        role: "user",
        createdAt: new Date(),
      },
    });

    let { result } = renderHook(() => useUserInfo());
    expect(result.current.avatar).toBe("firebase-avatar.jpg");

    // 2. userData 和 Firebase 用户都有头像
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user2", photoURL: "firebase-avatar.jpg" },
      userData: {
        uid: "user2",
        email: "user2@example.com",
        photoURL: "userdata-avatar.jpg",
        role: "user",
        createdAt: new Date(),
      },
    });

    result = renderHook(() => useUserInfo()).result;
    expect(result.current.avatar).toBe("userdata-avatar.jpg"); // userData 头像优先

    // 3. 都没有头像
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user3" },
      userData: {
        uid: "user3",
        email: "user3@example.com",
        role: "user",
        createdAt: new Date(),
      },
    });

    result = renderHook(() => useUserInfo()).result;
    expect(result.current.avatar).toBe("/images/default-avatar.png"); // 返回默认头像
  });

  test("在获取用户信息前处理边界情况", () => {
    // 模拟 useAuth 返回 undefined
    (useAuth as jest.Mock).mockReturnValue(undefined);

    // 确保钩子不会抛出错误
    expect(() => {
      renderHook(() => useUserInfo());
    }).not.toThrow();

    // 模拟 useAuth 返回不完整的对象
    (useAuth as jest.Mock).mockReturnValue({
      // 缺少 user 和 userData
    });

    const { result } = renderHook(() => useUserInfo());

    // 期望返回默认值
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.displayName).toBe("");
  });
});
