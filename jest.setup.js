// jest.setup.js
import "@testing-library/jest-dom";

// 为全局 fetch 提供 polyfill (如果需要)
import "whatwg-fetch";

// 禁用控制台错误
global.console = {
  ...console,
  // 不禁用 log，以便查看测试输出
  log: jest.fn(),
  // 默认情况下禁用警告和错误，以免测试输出中充斥着框架的警告
  error: jest.fn(),
  warn: jest.fn(),
};

// 模拟 next/router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

// 添加全局模拟，如果需要
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 创建模拟的 Intersection Observer
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// 清除所有模拟调用信息
beforeEach(() => {
  jest.clearAllMocks();
});
