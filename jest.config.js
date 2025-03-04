const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // 指向 Next.js 应用的路径
  dir: "./",
});

// Jest 的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // 处理模块别名
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  // 指定测试目录和文件命名格式
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};

// createJestConfig 会将 Next.js 配置与自定义配置合并
module.exports = createJestConfig(customJestConfig);
