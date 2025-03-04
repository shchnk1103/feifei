import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  // 保存原始对象以便测试后恢复
  const originalLocalStorage = window.localStorage;
  const originalDocumentElement = document.documentElement;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // 模拟 localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
      key: jest.fn(),
      length: 0,
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // 模拟 matchMedia
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false, // 默认系统偏好为浅色
      media: query,
      onchange: null,
      addListener: jest.fn(), // 兼容旧API
      removeListener: jest.fn(), // 兼容旧API
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // 模拟 document.documentElement
    Object.defineProperty(document.documentElement, "setAttribute", {
      value: jest.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    // 恢复原始对象
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
    });
    Object.defineProperty(window, "matchMedia", { value: originalMatchMedia });
    // document.documentElement 通常不需要恢复，因为它在测试环境中是隔离的
  });

  test("应使用系统偏好作为默认值 (浅色)", () => {
    // 模拟系统浅色主题偏好
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)" ? false : true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // 模拟localStorage没有存储主题
    localStorage.getItem = jest.fn().mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    // 验证localStorage被查询
    expect(localStorage.getItem).toHaveBeenCalledWith("theme");
  });

  test("应使用系统偏好作为默认值 (深色)", () => {
    // 模拟系统深色主题偏好
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)" ? true : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // 模拟localStorage没有存储主题
    localStorage.getItem = jest.fn().mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
  });

  test("应优先使用localStorage中的主题设置", () => {
    // 即使系统偏好是深色，也应该使用localStorage的设置
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)" ? true : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // 模拟localStorage有存储的主题
    localStorage.getItem = jest.fn().mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  test("toggleTheme 应该正确切换主题", () => {
    // 从浅色开始
    localStorage.getItem = jest.fn().mockReturnValue("light");

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");

    // 测试切换到深色
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

    // 测试切换回浅色
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  test("主题变化时应设置document的data-theme属性", () => {
    localStorage.getItem = jest.fn().mockReturnValue("light");

    renderHook(() => useTheme());

    // 验证初始设置
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light"
    );

    // 清除调用记录
    (document.documentElement.setAttribute as jest.Mock).mockClear();

    // 重新渲染为深色
    localStorage.getItem = jest.fn().mockReturnValue("dark");

    renderHook(() => useTheme());

    // 验证更新了设置
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark"
    );
  });
});
