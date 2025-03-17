"use client";

import { useState } from "react";
import { authService } from "@/modules/auth/services/authService";

interface LogoutButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function LogoutButton({
  className = "",
  onSuccess,
  onError,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      onSuccess?.();
    } catch (error) {
      console.error("登出失败:", error);
      if (error instanceof Error) {
        onError?.(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 ${className}`}
    >
      {isLoading ? "登出中..." : "登出"}
    </button>
  );
}
