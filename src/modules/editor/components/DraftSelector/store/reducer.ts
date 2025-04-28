import { DraftState, DraftAction, DraftError } from "./types";

/**
 * 草稿选择器的初始状态
 */
export const initialState: DraftState = {
  drafts: [],
  isLoading: true,
  deleteState: {
    confirmingId: null,
    isDeleting: false,
    pendingDeletes: new Set(),
  },
  error: null,
};

/**
 * 创建错误对象
 * @param type 错误类型
 * @param message 错误消息
 * @param originalError 原始错误
 * @returns DraftError 对象
 */
export function createError(
  type: DraftError["type"],
  message: string,
  originalError?: unknown
): DraftError {
  return {
    type,
    message,
    retryable: type === "NETWORK_ERROR",
    originalError,
  };
}

/**
 * 草稿选择器的 reducer 函数
 * @param state 当前状态
 * @param action 动作
 * @returns 新的状态
 */
export function draftReducer(
  state: DraftState,
  action: DraftAction
): DraftState {
  switch (action.type) {
    case "SET_DRAFTS":
      return {
        ...state,
        drafts: action.payload,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "DELETE_ERROR":
      return {
        ...state,
        error: action.payload,
        deleteState: {
          ...state.deleteState,
          isDeleting: false,
          confirmingId: null,
        },
      };
    case "START_DELETE":
      return {
        ...state,
        deleteState: {
          ...state.deleteState,
          confirmingId: action.payload,
        },
      };
    case "CANCEL_DELETE":
      return {
        ...state,
        deleteState: {
          ...state.deleteState,
          confirmingId: null,
        },
      };
    case "DELETE_OPTIMISTIC":
      return {
        ...state,
        drafts: state.drafts.filter((draft) => draft.id !== action.payload),
        deleteState: {
          ...state.deleteState,
          confirmingId: null,
          isDeleting: true,
          pendingDeletes: new Set([
            ...state.deleteState.pendingDeletes,
            action.payload,
          ]),
        },
      };
    case "DELETE_ROLLBACK": {
      const newPendingDeletes = new Set(state.deleteState.pendingDeletes);
      newPendingDeletes.delete(action.payload);
      return {
        ...state,
        deleteState: {
          ...state.deleteState,
          isDeleting: false,
          pendingDeletes: newPendingDeletes,
        },
      };
    }
    case "DELETE_SUCCESS": {
      const newPendingDeletes = new Set(state.deleteState.pendingDeletes);
      newPendingDeletes.delete(action.payload);
      return {
        ...state,
        deleteState: {
          ...state.deleteState,
          isDeleting: false,
          pendingDeletes: newPendingDeletes,
        },
      };
    }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
