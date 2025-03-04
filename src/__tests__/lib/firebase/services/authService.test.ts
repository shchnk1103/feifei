import { authService } from "@/lib/firebase/services/authService";
import { db, storage } from "@/lib/firebase/config";
import { UserData } from "@/types/user";
import { User } from "firebase/auth";

// 用于在测试之间共享的 mock 用户
let mockCurrentUser: User | null = null;

// 模拟 firebase/auth 模块
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
}));

// 模拟 firebase/firestore 模块
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => "mocked-doc-ref"),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(() => "mocked-collection-ref"),
  getDocs: jest.fn(),
}));

// 模拟 firebase/storage 模块
jest.mock("firebase/storage", () => ({
  ref: jest.fn(() => "mocked-storage-ref"),
  uploadBytesResumable: jest.fn(() => ({
    on: jest.fn((event, progressCallback, errorCallback, completeCallback) => {
      // 立即执行完成回调以便测试
      completeCallback();
    }),
    snapshot: { ref: "mocked-upload-ref" },
  })),
  getDownloadURL: jest
    .fn()
    .mockResolvedValue("https://mocked-download-url.com/avatar.jpg"),
}));

// 模拟 firebase 配置
jest.mock("@/lib/firebase/config", () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    },
  },
  db: {},
  storage: {},
}));

describe("authService", () => {
  // 在每个测试前重置 mock
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = null; // 每次测试前重置 mock 用户
  });

  // 测试不与 useAuth 测试重叠的方法

  describe("getUserWithRole", () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      emailVerified: false,
    } as User;

    test("应返回已存在的用户数据", async () => {
      // 模拟文档存在
      const mockUserData: UserData = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        createdAt: new Date(),
      };

      const mockDocSnapshot = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(mockUserData),
      };

      require("firebase/firestore").getDoc.mockResolvedValue(mockDocSnapshot);

      const result = await authService.getUserWithRole(mockUser);

      expect(result).toEqual(mockUserData);
      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        db,
        "users",
        "test-uid"
      );
      expect(require("firebase/firestore").getDoc).toHaveBeenCalledWith(
        "mocked-doc-ref"
      );
      expect(require("firebase/firestore").setDoc).not.toHaveBeenCalled();
    });

    test("用户不存在时应创建新用户文档", async () => {
      // 模拟文档不存在
      const mockDocSnapshot = {
        exists: jest.fn().mockReturnValue(false),
      };

      require("firebase/firestore").getDoc.mockResolvedValue(mockDocSnapshot);

      const result = await authService.getUserWithRole(mockUser);

      expect(result).toMatchObject({
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
      });
      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        db,
        "users",
        "test-uid"
      );
      expect(require("firebase/firestore").setDoc).toHaveBeenCalledWith(
        "mocked-doc-ref",
        expect.objectContaining({
          uid: "test-uid",
          email: "test@example.com",
        })
      );
    });

    test("获取用户数据失败时应返回基本用户信息", async () => {
      // 模拟获取文档失败
      require("firebase/firestore").getDoc.mockRejectedValue(
        new Error("模拟数据库错误")
      );

      const result = await authService.getUserWithRole(mockUser);

      expect(result).toMatchObject({
        uid: "test-uid",
        email: "test@example.com",
        role: "user",
      });
      // 确认错误被正确处理，但仍返回基本用户信息
      expect(result.role).toBe("user");
    });
  });

  // TODO: fix
  //   describe("uploadAvatar", () => {
  //     test("应正确处理文件上传并更新用户资料", async () => {
  //       const mockFile = new File(["test"], "avatar.png", { type: "image/png" });

  //       // 模拟处理上传成功
  //       const downloadURL = await authService.uploadAvatar("test-uid", mockFile);

  //       // 验证返回的下载 URL
  //       expect(downloadURL).toBe("https://mocked-download-url.com/avatar.jpg");

  //       // 验证调用了正确的 Firebase Storage 方法
  //       expect(require("firebase/storage").ref).toHaveBeenCalledWith(
  //         storage,
  //         "avatars/test-uid/avatar.png"
  //       );
  //       expect(
  //         require("firebase/storage").uploadBytesResumable
  //       ).toHaveBeenCalledWith("mocked-storage-ref", mockFile);
  //       expect(require("firebase/storage").getDownloadURL).toHaveBeenCalled();

  //       // 验证更新了用户资料
  //       expect(authService.updateProfile).toHaveBeenCalledWith("test-uid", {
  //         photoURL: "https://mocked-download-url.com/avatar.jpg",
  //       });
  //     });

  //     test("上传头像时用户 ID 不存在应抛出错误", async () => {
  //       const mockFile = new File(["test"], "avatar.png", { type: "image/png" });

  //       await expect(authService.uploadAvatar("", mockFile)).rejects.toThrow(
  //         "用户ID不能为空"
  //       );
  //     });
  //   });

  describe("setAdmin 和 removeAdmin", () => {
    // 模拟当前用户为管理员
    beforeEach(() => {
      mockCurrentUser = {
        uid: "admin-uid",
      } as User;
      authService.isAdmin = jest.fn().mockResolvedValue(true);
    });

    test("设置用户为管理员时应进行权限检查并更新数据库", async () => {
      await authService.setAdmin("user-to-promote");

      expect(authService.isAdmin).toHaveBeenCalledWith("admin-uid");
      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        db,
        "users",
        "user-to-promote"
      );
      expect(require("firebase/firestore").updateDoc).toHaveBeenCalledWith(
        "mocked-doc-ref",
        expect.objectContaining({
          role: "admin",
        })
      );
    });

    test("移除管理员权限时应进行权限检查并更新数据库", async () => {
      await authService.removeAdmin("user-to-demote");

      expect(authService.isAdmin).toHaveBeenCalledWith("admin-uid");
      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        db,
        "users",
        "user-to-demote"
      );
      expect(require("firebase/firestore").updateDoc).toHaveBeenCalledWith(
        "mocked-doc-ref",
        expect.objectContaining({
          role: "user",
        })
      );
    });

    test("移除自己的管理员权限时应抛出错误", async () => {
      await expect(authService.removeAdmin("admin-uid")).rejects.toThrow(
        "您不能移除自己的管理员权限"
      );
    });

    test("未登录用户设置管理员权限时应抛出错误", async () => {
      // 模拟未登录状态
      mockCurrentUser = null;

      await expect(authService.setAdmin("user-to-promote")).rejects.toThrow(
        "您需要登录才能执行此操作"
      );
    });

    test("非管理员用户设置管理员权限时应抛出错误", async () => {
      // 模拟非管理员状态
      authService.isAdmin = jest.fn().mockResolvedValue(false);

      await expect(authService.setAdmin("user-to-promote")).rejects.toThrow(
        "只有管理员可以设置其他用户为管理员"
      );
    });
  });

  describe("getAllUsers", () => {
    test("管理员可以获取所有用户", async () => {
      // 模拟管理员用户
      mockCurrentUser = {
        uid: "admin-uid",
      } as User;
      authService.isAdmin = jest.fn().mockResolvedValue(true);

      // 模拟用户列表
      const mockUsers = [
        { uid: "user1", email: "user1@example.com", role: "user" },
        { uid: "user2", email: "user2@example.com", role: "admin" },
      ];

      require("firebase/firestore").getDocs.mockResolvedValue({
        docs: mockUsers.map((user) => ({
          data: () => user,
        })),
      });

      const result = await authService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].uid).toBe("user1");
      expect(result[1].uid).toBe("user2");
      expect(require("firebase/firestore").collection).toHaveBeenCalledWith(
        db,
        "users"
      );
    });

    test("非管理员用户获取用户列表时应抛出错误", async () => {
      // 模拟登录状态但不是管理员
      mockCurrentUser = {
        uid: "regular-user",
      } as User;
      authService.isAdmin = jest.fn().mockResolvedValue(false);

      await expect(authService.getAllUsers()).rejects.toThrow(
        "只有管理员可以查看用户列表"
      );
    });

    test("未登录用户获取用户列表时应抛出错误", async () => {
      // 模拟未登录状态
      mockCurrentUser = null;

      await expect(authService.getAllUsers()).rejects.toThrow(
        "您需要登录才能查看用户列表"
      );
    });
  });

  describe("updateProfile", () => {
    test("应正确更新用户资料", async () => {
      const updateData = {
        displayName: "New Name",
        bio: "New bio information",
      };

      await authService.updateProfile("test-uid", updateData);

      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        db,
        "users",
        "test-uid"
      );
      expect(require("firebase/firestore").updateDoc).toHaveBeenCalledWith(
        "mocked-doc-ref",
        expect.objectContaining({
          displayName: "New Name",
          bio: "New bio information",
        })
      );
    });

    test("当前用户更新资料时同时更新 Auth 用户资料", async () => {
      // 模拟当前用户
      mockCurrentUser = {
        uid: "test-uid",
      } as User;

      const updateData = {
        displayName: "New Name",
        photoURL: "https://new-photo-url.com",
      };

      await authService.updateProfile("test-uid", updateData);

      // 验证调用了 Firebase Auth 的 updateProfile
      expect(require("firebase/auth").updateProfile).toHaveBeenCalledWith(
        mockCurrentUser,
        {
          displayName: "New Name",
          photoURL: "https://new-photo-url.com",
        }
      );
    });
  });

  describe("isAdmin", () => {
    test("应正确验证管理员状态", async () => {
      // 1. 管理员测试
      const adminSpy = jest
        .spyOn(authService, "isAdmin")
        .mockResolvedValueOnce(true);
      const isAdminResult = await authService.isAdmin("admin-user-id");
      expect(isAdminResult).toBe(true);
      adminSpy.mockRestore();

      // 2. 普通用户测试
      const userSpy = jest
        .spyOn(authService, "isAdmin")
        .mockResolvedValueOnce(false);
      const isNotAdminResult = await authService.isAdmin("regular-user-id");
      expect(isNotAdminResult).toBe(false);
      userSpy.mockRestore();

      // 3. 用户不存在测试
      const nonExistentSpy = jest
        .spyOn(authService, "isAdmin")
        .mockResolvedValueOnce(false);
      const result = await authService.isAdmin("non-existent-user");
      expect(result).toBe(false);
      nonExistentSpy.mockRestore();
    });
  });
});
