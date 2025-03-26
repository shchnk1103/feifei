"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserInfo } from "@/modules/auth";
import styles from "./profile.module.css";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import { getUserAvatar } from "@/modules/auth/types/user";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

// 表单数据类型
interface ProfileFormData {
  displayName: string;
  bio: string;
  photoURL: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { userInfo, displayName, isLoggedIn } = useUserInfo();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 表单数据状态
  const [formData, setFormData] = useState<ProfileFormData>(() => ({
    displayName: userInfo.userData?.displayName || displayName || "",
    bio: userInfo.userData?.bio || "",
    photoURL: userInfo.userData?.photoURL || getUserAvatar(userInfo),
  }));

  // 当用户数据发生实质性变化时更新表单数据
  useEffect(() => {
    const newDisplayName = userInfo.userData?.displayName || displayName || "";
    const newBio = userInfo.userData?.bio || "";
    const newPhotoURL = userInfo.userData?.photoURL || getUserAvatar(userInfo);

    setFormData((prev) => {
      // 只有当值真正发生变化时才更新状态
      if (
        prev.displayName === newDisplayName &&
        prev.bio === newBio &&
        prev.photoURL === newPhotoURL
      ) {
        return prev;
      }
      return {
        displayName: newDisplayName,
        bio: newBio,
        photoURL: newPhotoURL,
      };
    });
  }, [userInfo, displayName]);

  useEffect(() => {
    // 检查当前登录用户是否是正在查看的个人资料
    const isCurrentUserProfile =
      isLoggedIn &&
      (displayName === username || // 通过显示名称匹配
        userInfo.firebaseUser?.uid === username || // 通过 UID 匹配
        userInfo.firebaseUser?.email?.split("@")[0] === username); // 通过邮箱用户名匹配

    setIsCurrentUser(isCurrentUserProfile);
  }, [isLoggedIn, displayName, username, userInfo]);

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // 这里应该调用API来更新用户信息
      // 目前只是模拟成功
      console.log("提交的表单数据:", formData);

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "个人资料已成功更新！",
      });

      // 刷新页面数据
      router.refresh();
    } catch (error) {
      console.error("更新个人资料时出错:", error);
      setMessage({
        type: "error",
        text: "更新个人资料时出错，请稍后再试。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <h1>请先登录</h1>
        <p>您需要登录才能查看或编辑个人资料</p>
      </div>
    );
  }

  // 格式化日期显示
  const formatDate = (date?: Date | Timestamp | null) => {
    if (!date) return "未知";

    try {
      // 如果是 Timestamp 对象，转换为 Date
      const dateObj = date instanceof Timestamp ? date.toDate() : date;
      return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
    } catch (error) {
      console.error("日期格式化错误:", error);
      return "未知";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <OptimizedImage
            src={getUserAvatar(userInfo)}
            alt={`${displayName}的头像`}
            width={120}
            height={120}
            className={styles.avatar}
          />
          {isCurrentUser && (
            <button className={styles.changeAvatarButton}>更换头像</button>
          )}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.username}>{username}</h1>
          {userInfo.userData?.bio ? (
            <p className={styles.bio}>{userInfo.userData.bio}</p>
          ) : (
            isCurrentUser && (
              <p className={styles.noBio}>添加个人简介，让其他用户了解你</p>
            )
          )}

          <div className={styles.userMeta}>
            {userInfo.userData?.role === "admin" && (
              <span className={styles.roleBadge}>管理员</span>
            )}
            <p className={styles.metaInfo}>
              注册时间: {formatDate(userInfo.userData?.createdAt)}
            </p>
            <p className={styles.metaInfo}>
              上次登录: {formatDate(userInfo.userData?.lastLogin)}
            </p>
            {userInfo.userData?.isEmailVerified && (
              <p className={styles.verifiedEmail}>
                <span className={styles.verifiedIcon}>✓</span> 已验证邮箱
              </p>
            )}
          </div>
        </div>
      </div>

      {isCurrentUser && (
        <div className={styles.editSection}>
          <h2 className={styles.sectionTitle}>编辑个人资料</h2>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form className={styles.profileForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="displayName" className={styles.label}>
                显示名称
              </label>
              <input
                type="text"
                id="displayName"
                className={styles.input}
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="输入您的显示名称"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio" className={styles.label}>
                个人简介
              </label>
              <textarea
                id="bio"
                className={styles.textarea}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="介绍一下自己吧"
                rows={4}
              />
              <p className={styles.helperText}>
                简短介绍一下自己，让其他用户了解你
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                电子邮箱
              </label>
              <input
                type="email"
                id="email"
                className={styles.input}
                defaultValue={userInfo.firebaseUser?.email || ""}
                disabled
              />
              <p className={styles.helperText}>
                邮箱地址不可更改
                {!userInfo.userData?.isEmailVerified && (
                  <span className={styles.warningText}> - 邮箱未验证</span>
                )}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="accountInfo" className={styles.label}>
                账号信息
              </label>
              <div className={styles.accountInfoBox}>
                <p>
                  <strong>用户ID:</strong> {userInfo.userData?.uid}
                </p>
                <p>
                  <strong>账号角色:</strong>{" "}
                  {userInfo.userData?.role === "admin" ? "管理员" : "普通用户"}
                </p>
                <p>
                  <strong>注册时间:</strong>{" "}
                  {formatDate(userInfo.userData?.createdAt)}
                </p>
                <p>
                  <strong>上次更新:</strong>{" "}
                  {formatDate(userInfo.userData?.updatedAt)}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "保存中..." : "保存更改"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
