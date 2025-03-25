// 这个文件只是一个智能代理，根据环境导出适当的Firebase实现
// 不要在这里直接导入admin模块，否则会导致客户端构建问题

// 导出客户端Firebase实现
export * from "./config";
export * from "./utils";

// 注意：admin.ts应该只在服务器端API routes或Server Components中直接导入
// import { db as adminDb, adminStorage } from './admin';
