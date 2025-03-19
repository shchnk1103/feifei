// 保存相关常量配置
export const CONFIG = {
  // 数据库相关延迟
  DB_SAVE_DELAY: 10000, // 数据库保存延迟（毫秒）- 设置为10秒
  LOCAL_SAVE_DELAY: 1000, // 本地保存延迟（毫秒）- 设置为1秒
  EDITING_IDLE_DELAY: 5000, // 停止编辑后保存到数据库的延迟（毫秒）
  DEBOUNCE_WAIT: 2000, // 防抖等待时间（毫秒）

  // 日志相关
  DEBUG: true, // 是否启用调试日志
};

/**
 * 条件性日志输出
 * 只有在DEBUG模式下才会输出日志
 */
export function log(message: string, data?: unknown): void {
  if (CONFIG.DEBUG) {
    if (data) {
      console.log(`[调试] ${message}`, data);
    } else {
      console.log(`[调试] ${message}`);
    }
  }
}

export function logError(message: string, error?: unknown): void {
  if (CONFIG.DEBUG) {
    if (error) {
      console.error(`[调试] ${message}`, error);
    } else {
      console.error(`[调试] ${message}`);
    }
  }
}
