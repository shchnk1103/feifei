import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth, AuthProvider } from "@/modules/auth";
import { authService } from "@/modules/auth/services/authService";
import { User } from "firebase/auth";
import { UserData } from "@/modules/auth/types/user";

// 模拟 Firebase Auth User
const mockFirebaseUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
  emailVerified: false,
} as User;

// 模拟用户数据
const mockUserData: UserData = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  role: "user",
  createdAt: new Date(),
  photoURL: null,
  isEmailVerified: false,
};

// 模拟管理员数据
const mockAdminData: UserData = {
  ...mockUserData,
  role: "admin",
};

// 模拟 authService
jest.mock("@/modules/auth/services/authService", () => ({
  authService: {
    onAuthStateChange: jest.fn(() => jest.fn()), // 简单返回卸载函数
    getUserWithRole: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    setAdmin: jest.fn(),
    removeAdmin: jest.fn(),
    getUserData: jest.fn(),
    isAdmin: jest.fn(),
  },
}));

// 用于包装 useAuth 钩子的测试组件
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth", () => {
  // 每个测试前重置所有 mock
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. 测试初始状态
  test("初始状态应该正确", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.userData).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.loading).toBe(true); // 初始应该正在加载
    expect(result.current.error).toBeNull();
  });

  // 2. 测试在 Provider 外部使用时抛出错误
  test("在 AuthProvider 外部使用时应抛出错误", () => {
    // 使用控制台间谍来捕获错误
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // 直接渲染钩子，不使用 Provider
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth 必须在 AuthProvider 内部使用");

    // 恢复控制台
    consoleErrorSpy.mockRestore();
  });

  // 3. 测试认证状态变化
  test("当用户登录时应更新状态", async () => {
    // 模拟 getUserWithRole 的返回值
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 初始状态检查
    expect(result.current.loading).toBe(true);

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 手动触发 onAuthStateChange 回调以模拟用户登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    // 等待状态更新
    await waitFor(() => {
      expect(result.current.user).toBe(mockFirebaseUser);
      expect(result.current.userData).toEqual(mockUserData);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.loading).toBe(false);
    });

    // 验证调用
    expect(authService.getUserWithRole).toHaveBeenCalledWith(mockFirebaseUser);
  });

  test("当用户登出时应更新状态", async () => {
    // 首先模拟用户已登录
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟用户登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    await waitFor(() => {
      expect(result.current.user).toBe(mockFirebaseUser);
    });

    // 然后模拟用户登出
    act(() => {
      authStateCallback(null);
    });

    // 验证状态重置
    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.userData).toBeNull();
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  test("当用户是管理员时应正确设置 isAdmin", async () => {
    // 模拟管理员用户
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockAdminData);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟管理员登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    // 验证管理员状态
    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.userData?.role).toBe("admin");
    });
  });

  // 4. 测试登录功能
  test("login 成功时应返回用户数据", async () => {
    // 模拟登录成功
    (authService.login as jest.Mock).mockResolvedValue({
      user: mockFirebaseUser,
    });

    // 模拟 getUserWithRole 返回用户数据
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 使用显式返回值来测试
    await act(async () => {
      const returnedUserData = await result.current.login(
        "test@example.com",
        "password"
      );

      // 在 act 回调内部进行断言
      expect(returnedUserData).toEqual(mockUserData);
    });

    // 验证登录函数被调用
    expect(authService.login).toHaveBeenCalledWith(
      "test@example.com",
      "password"
    );
  });

  test("login 失败时应设置错误并抛出异常", async () => {
    // 模拟登录失败
    const mockError = new Error("登录失败");
    (authService.login as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let error: Error | null = null;

    await act(async () => {
      try {
        await result.current.login("test@example.com", "wrong-password");
      } catch (e) {
        error = e as Error;
      }
    });

    // 验证错误处理
    expect(error).toBe(mockError);
    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });

  // 5. 测试注册功能
  test("register 成功时应调用 authService.register", async () => {
    // 模拟注册成功
    (authService.register as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register("new@example.com", "password", {
        displayName: "New User",
      });
    });

    // 验证注册函数被调用
    expect(authService.register).toHaveBeenCalledWith(
      "new@example.com",
      "password",
      {
        displayName: "New User",
      }
    );

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("register 失败时应设置错误并抛出异常", async () => {
    // 模拟注册失败
    const mockError = new Error("注册失败");
    (authService.register as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let error: Error | null = null;

    await act(async () => {
      try {
        await result.current.register("new@example.com", "password");
      } catch (e) {
        error = e as Error;
      }
    });

    // 验证错误处理
    expect(error).toBe(mockError);
    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });

  // 6. 测试登出功能
  test("logout 成功时应清除用户数据", async () => {
    // 首先模拟用户已登录
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockUserData);
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟用户登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    await waitFor(() => {
      expect(result.current.user).toBe(mockFirebaseUser);
    });

    // 然后测试登出
    await act(async () => {
      await result.current.logout();
    });

    // 验证登出函数被调用
    expect(authService.logout).toHaveBeenCalled();

    // 注意：实际的用户状态会由 authStateChange 回调更新
    // 所以这里不验证 user 和 userData 的状态
  });

  test("logout 失败时应设置错误并抛出异常", async () => {
    // 模拟登出失败
    const mockError = new Error("登出失败");
    (authService.logout as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let error: Error | null = null;

    await act(async () => {
      try {
        await result.current.logout();
      } catch (e) {
        error = e as Error;
      }
    });

    // 验证错误处理
    expect(error).toBe(mockError);
    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });

  // 7. 测试更新用户资料
  test("updateUserProfile 成功时应更新用户数据", async () => {
    // 首先模拟用户已登录
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockUserData);
    (authService.updateProfile as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟用户登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    await waitFor(() => {
      expect(result.current.user).toBe(mockFirebaseUser);
    });

    // 测试更新资料
    const updateData = { displayName: "Updated Name", bio: "New bio" };

    await act(async () => {
      await result.current.updateUserProfile(updateData);
    });

    // 验证更新函数被调用
    expect(authService.updateProfile).toHaveBeenCalledWith(
      mockFirebaseUser.uid,
      updateData
    );

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("updateUserProfile 在未登录时应抛出异常", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let error: unknown = null; // 使用 unknown 类型

    await act(async () => {
      try {
        await result.current.updateUserProfile({ displayName: "Test" });
      } catch (e) {
        error = e; // 不进行类型断言
      }
    });

    // 验证错误是 Error 类型
    expect(error).toBeInstanceOf(Error);

    // 使用类型保护
    if (error instanceof Error) {
      expect(error.message).toContain("登录");
    }
  });

  // 8. 测试管理员功能
  test("setUserAsAdmin 成功时应调用 authService.setAdmin", async () => {
    // 首先模拟管理员已登录
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockAdminData);
    (authService.setAdmin as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟管理员登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    // 测试设置管理员
    await act(async () => {
      await result.current.setUserAsAdmin("another-user-id");
    });

    // 验证调用
    expect(authService.setAdmin).toHaveBeenCalledWith("another-user-id");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("removeUserAdmin 成功时应调用 authService.removeAdmin", async () => {
    // 首先模拟管理员已登录
    (authService.getUserWithRole as jest.Mock).mockResolvedValue(mockAdminData);
    (authService.removeAdmin as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 获取传递给 onAuthStateChange 的回调函数
    const authStateCallback = (authService.onAuthStateChange as jest.Mock).mock
      .calls[0][0];

    // 模拟管理员登录
    act(() => {
      authStateCallback(mockFirebaseUser);
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    // 测试移除管理员
    await act(async () => {
      await result.current.removeUserAdmin("another-user-id");
    });

    // 验证调用
    expect(authService.removeAdmin).toHaveBeenCalledWith("another-user-id");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  // 9. 测试加载状态管理
  test("操作期间应正确设置和清除加载状态", async () => {
    // 延迟解决的 Promise 来测试加载状态
    (authService.login as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ user: mockFirebaseUser }), 100);
      });
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let promise: Promise<any>;

    act(() => {
      promise = result.current.login("test@example.com", "password");
    });

    // 验证加载状态已设置
    expect(result.current.loading).toBe(true);

    await act(async () => {
      await promise;
    });

    // 验证加载状态已清除
    expect(result.current.loading).toBe(false);
  });

  // 10. 测试错误处理
  test("操作失败时应正确设置错误状态", async () => {
    const mockError = new Error("操作失败");
    (authService.login as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login("test@example.com", "password");
      } catch (e) {
        // 捕获错误，但不做任何处理
      }
    });

    // 验证错误状态
    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });

  // 11. 测试组件卸载
  test("组件卸载时应取消 onAuthStateChange 订阅", () => {
    const unsubscribeMock = jest.fn();
    (authService.onAuthStateChange as jest.Mock).mockReturnValue(
      unsubscribeMock
    );

    const { unmount } = renderHook(() => useAuth(), { wrapper });

    // 卸载组件
    unmount();

    // 验证取消订阅函数被调用
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
