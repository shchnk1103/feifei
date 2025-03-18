"use client";

import { memo } from "react";
import { BiGlobe, BiLock, BiMessageSquare } from "react-icons/bi";
import styles from "./styles.module.css";

export type Visibility = "public" | "private";

interface PermissionSettingsProps {
  visibility: Visibility;
  allowComments: boolean;
  onChange: (settings: {
    visibility: Visibility;
    allowComments: boolean;
  }) => void;
}

export const PermissionSettings = memo(function PermissionSettings({
  visibility,
  allowComments,
  onChange,
}: PermissionSettingsProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>权限设置</h3>

      <div className={styles.settingsGroup}>
        <div className={styles.settingItem}>
          <label className={styles.label}>可见性</label>
          <div className={styles.options}>
            <button
              className={`${styles.option} ${
                visibility === "public" ? styles.selected : ""
              }`}
              onClick={() => onChange({ visibility: "public", allowComments })}
            >
              <BiGlobe className={styles.icon} />
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>公开</span>
                <span className={styles.optionDescription}>所有人可见</span>
              </div>
            </button>

            <button
              className={`${styles.option} ${
                visibility === "private" ? styles.selected : ""
              }`}
              onClick={() => onChange({ visibility: "private", allowComments })}
            >
              <BiLock className={styles.icon} />
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>私密</span>
                <span className={styles.optionDescription}>仅自己可见</span>
              </div>
            </button>
          </div>
        </div>

        <div className={styles.settingItem}>
          <label className={styles.label}>评论设置</label>
          <div className={styles.options}>
            <button
              className={`${styles.option} ${
                allowComments ? styles.selected : ""
              }`}
              onClick={() => onChange({ visibility, allowComments: true })}
            >
              <BiMessageSquare className={styles.icon} />
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>允许评论</span>
                <span className={styles.optionDescription}>
                  读者可以发表评论
                </span>
              </div>
            </button>

            <button
              className={`${styles.option} ${
                !allowComments ? styles.selected : ""
              }`}
              onClick={() => onChange({ visibility, allowComments: false })}
            >
              <BiMessageSquare className={styles.icon} />
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>禁止评论</span>
                <span className={styles.optionDescription}>关闭评论功能</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
