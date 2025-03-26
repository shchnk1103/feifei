"use client";

import { useUserSettings } from "@/shared/contexts/AppContextProvider";
import { useTheme } from "@/modules/theme";
import styles from "./styles.module.css";

export function UserSettingsPanel() {
  const { settings, updateSettings, resetSettings } = useUserSettings();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>用户设置</h2>

      <div className={styles.section}>
        <h3>主题设置</h3>
        <div className={styles.option}>
          <label>主题：</label>
          <span>{theme === "light" ? "浅色" : "深色"}</span>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            切换主题
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>显示设置</h3>
        <div className={styles.option}>
          <label>字体大小：</label>
          <select
            value={settings.fontSize}
            onChange={(e) =>
              updateSettings({
                fontSize: e.target.value as "small" | "medium" | "large",
              })
            }
            className={styles.select}
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>

        <div className={styles.option}>
          <label>侧边栏：</label>
          <select
            value={settings.sidebar}
            onChange={(e) =>
              updateSettings({
                sidebar: e.target.value as "expanded" | "collapsed",
              })
            }
            className={styles.select}
          >
            <option value="expanded">展开</option>
            <option value="collapsed">折叠</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <h3>通知设置</h3>
        <div className={styles.option}>
          <label>
            <input
              type="checkbox"
              checked={settings.showNotifications}
              onChange={(e) =>
                updateSettings({ showNotifications: e.target.checked })
              }
              className={styles.checkbox}
            />
            显示通知
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h3>语言设置</h3>
        <div className={styles.option}>
          <label>语言：</label>
          <select
            value={settings.language}
            onChange={(e) =>
              updateSettings({ language: e.target.value as "zh" | "en" })
            }
            className={styles.select}
          >
            <option value="zh">中文</option>
            <option value="en">英文</option>
          </select>
        </div>
      </div>

      <button onClick={resetSettings} className={styles.resetButton}>
        重置所有设置
      </button>
    </div>
  );
}
