import { auth, db, storage } from "../config";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UserData } from "../types/user";

/**
 * 用户资料服务
 *
 * 提供用户资料管理功能，包括：
 * - 更新用户资料
 * - 上传用户头像
 */
export const userProfileService = {
  /**
   * 更新用户资料
   * @param uid - 用户ID
   * @param data - 要更新的用户数据
   */
  async updateProfile(
    uid: string,
    data: Partial<Pick<UserData, "name" | "photoURL" | "bio">>
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
        displayName: data.name,
        photoURL: data.photoURL,
      });
    }
  },

  /**
   * 上传用户头像
   * @param uid - 用户ID
   * @param file - 头像文件
   * @returns 头像URL
   */
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
};
