"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// 定义用户设置类型
interface UserSettings {
  fontSize: "small" | "medium" | "large";
  showNotifications: boolean;
  language: "zh" | "en";
  sidebar: "expanded" | "collapsed";
}

// 定义Context的类型
interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

// 默认设置
const defaultSettings: UserSettings = {
  fontSize: "medium",
  showNotifications: true,
  language: "zh",
  sidebar: "expanded",
};

// 创建Context
const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

// 创建Provider组件
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  // 使用useState来存储设置，初始值从localStorage加载或使用默认设置
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // 当组件加载时从localStorage读取设置
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
  }, []);

  // 当设置变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  // 更新设置的函数
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // 重置设置到默认值的函数
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <UserSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

// 创建自定义Hook来使用Context
export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
}
