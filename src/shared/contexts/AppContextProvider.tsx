"use client";

import { ReactNode } from "react";
import { UserSettingsProvider } from "./UserSettingsContext";
import { ThemeProvider } from "@/modules/theme";
import { AuthProvider } from "@/modules/auth";
import { SessionProvider } from "@/shared/components/providers/SessionProvider";

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * 应用程序Context Provider
 * 整合所有的Context Provider，减少嵌套层级
 */
export function AppContextProvider({ children }: AppContextProviderProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          <UserSettingsProvider>{children}</UserSettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

// 导出所有的Context hooks，方便使用
export { useTheme } from "@/modules/theme";
export { useUserSettings } from "./UserSettingsContext";
export { useAuth } from "@/modules/auth";
export { useSession } from "next-auth/react";
