import { Article } from "@/modules/blog/types/blog";

/**
 * 草稿错误类型枚举
 */
export enum DraftErrorType {
  /** 网络错误 */
  NETWORK_ERROR = "NETWORK_ERROR",
  /** 权限错误 */
  PERMISSION_ERROR = "PERMISSION_ERROR",
  /** 存储错误 */
  STORAGE_ERROR = "STORAGE_ERROR",
  /** 未知错误 */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 草稿错误信息接口
 */
export interface DraftError {
  /** 错误类型 */
  type: DraftErrorType;
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string;
  /** 是否可重试 */
  retryable?: boolean;
  /** 原始错误对象 */
  originalError?: unknown;
}

/**
 * 草稿选择器的状态接口
 */
export interface DraftState {
  /** 草稿列表 */
  drafts: Article[];
  /** 是否正在加载 */
  isLoading: boolean;
  /** 删除操作的状态 */
  deleteState: {
    /** 正在确认删除的草稿ID */
    confirmingId: string | null;
    /** 是否正在执行删除操作 */
    isDeleting: boolean;
    /** 待删除的草稿ID集合 */
    pendingDeletes: Set<string>;
  };
  /** 错误状态 */
  error: DraftError | null;
}

/**
 * 草稿选择器的动作类型
 */
export type DraftAction =
  | { type: "SET_DRAFTS"; payload: Article[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "DELETE_ERROR"; payload: DraftError }
  | { type: "START_DELETE"; payload: string }
  | { type: "CANCEL_DELETE" }
  | { type: "DELETE_SUCCESS"; payload: string }
  | { type: "DELETE_OPTIMISTIC"; payload: string }
  | { type: "DELETE_ROLLBACK"; payload: string }
  | { type: "CLEAR_ERROR" };

/**
 * 草稿选择器的属性接口
 */
export interface DraftSelectorProps {
  /** 选择草稿时的回调函数 */
  onSelect: (articleId: string) => void;
}
