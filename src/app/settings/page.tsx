import { UserSettingsPanel } from "@/shared/components/ui/UserSettingsPanel";
import styles from "./page.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>个人设置</h1>
      <p className={styles.pageDescription}>
        在这里你可以管理应用程序的所有设置，包括主题、界面、通知和语言偏好。
      </p>

      <div className={styles.settingsWrapper}>
        <UserSettingsPanel />
      </div>
    </div>
  );
}
