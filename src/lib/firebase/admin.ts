import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// 检查必要的环境变量
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
] as const;

// 确保所有必需的环境变量都存在
const envVars = {} as Record<(typeof requiredEnvVars)[number], string>;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value) {
    console.error(`缺少必需的环境变量: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
  envVars[envVar] = value;
}

// 初始化 Firebase Admin SDK
let app;
try {
  if (!getApps().length) {
    console.log("正在初始化 Firebase Admin SDK...");
    app = initializeApp({
      credential: cert({
        projectId: envVars.FIREBASE_PROJECT_ID,
        clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
        // 环境变量中的换行符需要被正确解析
        privateKey: envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin SDK 初始化成功");
  } else {
    app = getApps()[0];
    console.log("使用已存在的 Firebase Admin SDK 实例");
  }
} catch (error) {
  console.error("Firebase Admin SDK 初始化失败:", error);
  throw error;
}

// 导出 Firestore 实例
let db: Firestore;
try {
  db = getFirestore(app);
  console.log("Firestore 实例创建成功");
} catch (error) {
  console.error("Firestore 实例创建失败:", error);
  throw error;
}

export { db };
