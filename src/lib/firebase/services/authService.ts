import { auth, db, storage } from "../config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// 从统一位置导入类型
import { UserData, UserRegistrationData } from "@/types/user";

export const authService = {
  // 注册新用户，默认为普通用户，可选择设置为管理员
  async register(
    email: string,
    password: string,
    additionalData: UserRegistrationData = {}
  ): Promise<UserData> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // 创建更完整的用户档案
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      createdAt: new Date(),
      role: additionalData.isAdmin ? "admin" : "user", // 设置角色
      isEmailVerified: user.emailVerified,
      lastLogin: new Date(),
      ...(additionalData.displayName
        ? { displayName: additionalData.displayName }
        : {}),
      ...(user.photoURL || additionalData.photoURL
        ? {
            photoURL: additionalData.photoURL || user.photoURL,
          }
        : {}),
      ...(additionalData.bio ? { bio: additionalData.bio } : {}),
    };

    // 存储用户数据到 Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    // 如果是管理员，在 Auth 中设置自定义声明
    if (additionalData.isAdmin) {
      await this.setAdminClaim(user.uid);
    }

    return userData;
  },

  // 用户登录
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // 用户登出
  async logout() {
    return signOut(auth);
  },

  // 监听用户状态
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // 更新用户资料
  async updateProfile(
    uid: string,
    data: {
      displayName?: string;
      photoURL?: string;
      bio?: string;
    }
  ): Promise<void> {
    const userRef = doc(db, "users", uid);

    // 更新 Firestore 中的用户数据
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });

    // 如果当前登录用户是正在更新的用户，也更新 Auth 用户资料
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === uid) {
      await firebaseUpdateProfile(currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }
  },

  // 上传用户头像
  async uploadAvatar(uid: string, file: File): Promise<string> {
    // 确保用户存在
    if (!uid) throw new Error("用户ID不能为空");

    // 创建存储引用
    const storageRef = ref(storage, `avatars/${uid}/${file.name}`);

    // 上传文件
    const uploadTask = uploadBytesResumable(storageRef, file);

    // 使用 Promise 包装上传过程
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // 可以用来跟踪上传进度
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`头像上传进度: ${progress}%`);
        },
        (error) => {
          // 处理错误
          reject(error);
        },
        async () => {
          // 上传完成，获取下载URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // 更新用户资料中的头像URL
          await this.updateProfile(uid, { photoURL: downloadURL });

          resolve(downloadURL);
        }
      );
    });
  },

  // 检查用户是否为管理员
  async isAdmin(uid: string): Promise<boolean> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      return userData.role === "admin";
    }

    return false;
  },

  // 设置管理员权限（应通过云函数实现，这里仅作示例）
  async setAdminClaim(uid: string): Promise<void> {
    // 实际实现应调用云函数
    console.log(`为用户 ${uid} 设置管理员权限 - 需要通过云函数实现`);

    // 更新用户角色为管理员
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "admin",
      updatedAt: new Date(),
    });
  },

  // 移除管理员权限（同样应通过云函数实现）
  async removeAdminClaim(uid: string): Promise<void> {
    // 实际实现应调用云函数
    console.log(`移除用户 ${uid} 的管理员权限 - 需要通过云函数实现`);

    // 更新用户角色为普通用户
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "user",
      updatedAt: new Date(),
    });
  },

  // 获取用户完整资料
  async getUserData(uid: string): Promise<UserData | null> {
    if (!uid) return null;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }

    return null;
  },

  // 获取用户完整资料与角色
  async getUserWithRole(user: User): Promise<UserData> {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // 返回完整的用户数据，包括角色
        return userDoc.data() as UserData;
      } else {
        // 用户文档不存在，创建基本文档
        const basicUserData: UserData = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "user", // 默认为普通用户
          createdAt: new Date(),
          lastLogin: new Date(),
          isEmailVerified: user.emailVerified,
        };

        // 保存到数据库
        await setDoc(userDocRef, basicUserData);

        return basicUserData;
      }
    } catch (error) {
      console.error("获取用户数据失败:", error);
      // 返回基本用户信息，角色设为用户
      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        createdAt: new Date(),
        lastLogin: new Date(),
        isEmailVerified: user.emailVerified,
      };
    }
  },

  // 设置用户为管理员
  async setAdmin(uid: string): Promise<void> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能执行此操作");
    }

    // 检查当前用户是否为管理员
    const isCurrentUserAdmin = await this.isAdmin(currentUser.uid);
    if (!isCurrentUserAdmin) {
      throw new Error("只有管理员可以设置其他用户为管理员");
    }

    // 设置目标用户为管理员
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "admin",
      updatedAt: new Date(),
    });
  },

  // 将管理员降级为普通用户
  async removeAdmin(uid: string): Promise<void> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能执行此操作");
    }

    // 检查当前用户是否为管理员
    const isCurrentUserAdmin = await this.isAdmin(currentUser.uid);
    if (!isCurrentUserAdmin) {
      throw new Error("只有管理员可以移除管理员权限");
    }

    // 防止自我降级
    if (currentUser.uid === uid) {
      throw new Error("您不能移除自己的管理员权限");
    }

    // 将目标用户设为普通用户
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: "user",
      updatedAt: new Date(),
    });
  },

  // 获取所有用户列表（仅管理员可用）
  async getAllUsers(): Promise<UserData[]> {
    // 获取当前用户
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("您需要登录才能查看用户列表");
    }

    // 检查是否为管理员
    const isCurrentUserAdmin = await this.isAdmin(currentUser.uid);
    if (!isCurrentUserAdmin) {
      throw new Error("只有管理员可以查看用户列表");
    }

    // 获取所有用户
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    return usersSnapshot.docs.map((doc) => doc.data() as UserData);
  },
};
