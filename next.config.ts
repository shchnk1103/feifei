/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/feifei-s-world.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // Add other domains as needed
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // @ts-expect-error - webpack配置类型未明确定义
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端webpack配置
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // 禁用Turbopack
  experimental: {
    // 如果需要使用Turbopack，可以添加其他兼容的配置
    // turbo: {}
    // 或者使用空对象暂时禁用Turbopack的警告
    turbo: {},
  },
};

module.exports = nextConfig;
