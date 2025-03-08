import { render, screen, fireEvent } from "@testing-library/react";
import { UserSection } from "@/shared/components/layout/Header/components/UserSection";
import { UserInfo } from "@/modules/auth/types/user";
import { User } from "firebase/auth";

// 创建更严格的 Firebase User 模拟对象
const createMockFirebaseUser = (
  overrides: Partial<User> = {}
): Partial<User> => ({
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
  ...overrides,
});

// 创建一个模拟的登录用户信息对象
const mockLoggedInUser: UserInfo = {
  firebaseUser: createMockFirebaseUser() as User,
  userData: {
    uid: "test-uid",
    email: "test@example.com",
    displayName: "Test User",
    role: "user",
    createdAt: new Date(),
  },
};

// 创建一个模拟的管理员用户信息对象
const mockAdminUser: UserInfo = {
  firebaseUser: createMockFirebaseUser({
    uid: "admin-uid",
    email: "admin@example.com",
    displayName: "Admin User",
  }) as User,
  userData: {
    uid: "admin-uid",
    email: "admin@example.com",
    displayName: "Admin User",
    role: "admin",
    createdAt: new Date(),
  },
};

// 创建一个模拟的未登录用户信息对象
const mockNotLoggedInUser: UserInfo = {
  firebaseUser: null,
  userData: null,
};

// 模拟 next/image 组件
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("UserSection", () => {
  test("未登录时显示登录按钮", () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();

    render(
      <UserSection
        user={mockNotLoggedInUser}
        onLogin={mockLogin}
        onLogout={mockLogout}
      />
    );

    const loginButton = screen.getByRole("button", { name: /登录/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  test("已登录时显示用户名和登出按钮", () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();

    render(
      <UserSection
        user={mockLoggedInUser}
        onLogin={mockLogin}
        onLogout={mockLogout}
      />
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByAltText("用户头像")).toBeInTheDocument();

    const logoutButton = screen.getByText(/登出/i);
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test("管理员用户显示管理员标记", () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();

    render(
      <UserSection
        user={mockAdminUser}
        onLogin={mockLogin}
        onLogout={mockLogout}
      />
    );

    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText(/管理员/i)).toBeInTheDocument();
  });

  test("点击登出按钮应调用 onClose 回调函数", () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();
    const mockClose = jest.fn();

    render(
      <UserSection
        user={mockLoggedInUser}
        onLogin={mockLogin}
        onLogout={mockLogout}
        onClose={mockClose}
      />
    );

    const logoutButton = screen.getByText(/登出/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("点击登录按钮应调用 onClose 回调函数", () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();
    const mockClose = jest.fn();

    render(
      <UserSection
        user={mockNotLoggedInUser}
        onLogin={mockLogin}
        onLogout={mockLogout}
        onClose={mockClose}
      />
    );

    const loginButton = screen.getByRole("button", { name: /登录/i });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("移动版本显示正确的功能元素", () => {
    render(
      <UserSection
        user={mockLoggedInUser}
        mobile={true}
        onLogin={jest.fn()}
        onLogout={jest.fn()}
      />
    );

    // 检查移动版本特有的元素或行为
    // 例如，移动版可能有"菜单"按钮而不是直接显示选项
    // 或者按钮排列方式不同
  });

  test("组件接受并处理移动端属性", () => {
    const { rerender } = render(
      <UserSection
        user={mockLoggedInUser}
        mobile={true}
        onLogin={jest.fn()}
        onLogout={jest.fn()}
      />
    );

    // 重渲染为非移动版本
    rerender(
      <UserSection
        user={mockLoggedInUser}
        mobile={false}
        onLogin={jest.fn()}
        onLogout={jest.fn()}
      />
    );

    // 确认组件不会因为传递 mobile 属性而崩溃
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
