import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";
import * as ThemeProviderModule from "@/modules/theme/contexts/ThemeProvider";

// 存储当前主题状态，供模拟组件使用
let currentTheme = "light";

// 模拟useTheme钩子
jest.mock("@/modules/theme/contexts/ThemeProvider", () => ({
  useTheme: jest.fn(() => ({
    theme: currentTheme,
    setTheme: jest.fn(),
  })),
}));

// 模拟framer-motion
jest.mock("framer-motion", () => {
  return {
    AnimatePresence: ({
      children,
    }: {
      children: React.ReactNode;
      mode?: string;
      initial?: boolean;
    }) => children,
    motion: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      svg: (props: any) => {
        // 直接根据当前主题设置data-testid
        return (
          <svg
            {...props}
            data-testid={
              currentTheme === "light"
                ? "sun"
                : currentTheme === "dark"
                ? "moon"
                : "system"
            }
          >
            {props.children}
          </svg>
        );
      },
    },
  };
});

describe("ThemeToggle组件", () => {
  // 在每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 测试渲染亮色主题图标
  test("当主题为light时，渲染太阳图标", () => {
    // 设置当前主题
    currentTheme = "light";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 检查太阳图标是否渲染
    expect(screen.getByTestId("sun")).toBeInTheDocument();
    // 检查其他图标是否不存在
    expect(screen.queryByTestId("moon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("system")).not.toBeInTheDocument();
  });

  // 测试渲染暗色主题图标
  test("当主题为dark时，渲染月亮图标", () => {
    // 设置当前主题
    currentTheme = "dark";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 检查月亮图标是否渲染
    expect(screen.getByTestId("moon")).toBeInTheDocument();
    // 检查其他图标是否不存在
    expect(screen.queryByTestId("sun")).not.toBeInTheDocument();
    expect(screen.queryByTestId("system")).not.toBeInTheDocument();
  });

  // 测试渲染系统主题图标
  test("当主题为system时，渲染系统图标", () => {
    // 设置当前主题
    currentTheme = "system";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 检查系统图标是否渲染
    expect(screen.getByTestId("system")).toBeInTheDocument();
    // 检查其他图标是否不存在
    expect(screen.queryByTestId("sun")).not.toBeInTheDocument();
    expect(screen.queryByTestId("moon")).not.toBeInTheDocument();
  });

  // 测试点击切换主题 - 从亮色到暗色
  test("点击时从light切换到dark主题", () => {
    // 设置当前主题
    currentTheme = "light";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 点击切换按钮
    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    // 验证setTheme被调用，且参数为"dark"
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  // 测试点击切换主题 - 从暗色到系统
  test("点击时从dark切换到system主题", () => {
    // 设置当前主题
    currentTheme = "dark";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 点击切换按钮
    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    // 验证setTheme被调用，且参数为"system"
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  // 测试点击切换主题 - 从系统到亮色
  test("点击时从system切换到light主题", () => {
    // 设置当前主题
    currentTheme = "system";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 点击切换按钮
    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    // 验证setTheme被调用，且参数为"light"
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  // 测试按钮的可访问性属性
  test("按钮具有正确的可访问性属性", () => {
    // 设置当前主题
    currentTheme = "light";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 检查按钮是否有正确的aria-label
    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button).toHaveAttribute("aria-label", "Toggle theme");
  });

  // 测试按钮的样式类
  test("按钮应用了正确的样式类", () => {
    // 设置当前主题
    currentTheme = "light";

    const mockSetTheme = jest.fn();
    jest.spyOn(ThemeProviderModule, "useTheme").mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // 检查按钮是否有themeToggle类
    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button.className).toContain("themeToggle");
  });
});
