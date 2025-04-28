/**
 * 草稿选择器的自定义 Hook
 *
 * 这个 Hook 负责管理草稿选择器的所有状态和操作，包括：
 * - 加载草稿列表
 * - 删除草稿
 * - 错误处理
 * - 状态管理
 *
 * @param firebaseUser - Firebase 用户对象，用于获取用户 ID
 * @returns 包含状态和操作方法的对象
 */
import { useReducer, useCallback } from "react";
import { ArticleStorage } from "@/modules/blog/storage/articleStorage";
import { DefaultArticleCreator } from "@/modules/blog/services/articleCreator";
import { draftReducer, initialState, createError } from "../store/reducer";
import { DraftErrorType } from "../store/types";
import { UserData } from "@/modules/auth/types/user";

export function useDraftSelector(firebaseUser: UserData | null) {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  /**
   * 加载草稿列表
   *
   * 从数据库和本地存储中获取草稿，合并并去重后按更新时间排序
   * 如果加载失败，会设置错误状态
   */
  const loadDrafts = useCallback(async () => {
    if (!firebaseUser?.id) {
      dispatch({ type: "SET_DRAFTS", payload: [] });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const storage = new ArticleStorage();

      // 从数据库获取草稿
      const databaseDrafts = await storage.getDraftsFromDatabase(
        firebaseUser.id
      );

      // 从本地存储获取草稿
      const localDrafts = storage.getDraftsByAuthor(firebaseUser.id);

      // 合并并去重
      const allDrafts = [...databaseDrafts, ...localDrafts];
      const uniqueDrafts = Array.from(
        new Map(allDrafts.map((draft) => [draft.id, draft])).values()
      );

      // 按更新时间排序
      const sortedDrafts = uniqueDrafts.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      dispatch({ type: "SET_DRAFTS", payload: sortedDrafts });
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("加载草稿失败:", error);
      dispatch({
        type: "DELETE_ERROR",
        payload: createError(
          DraftErrorType.STORAGE_ERROR,
          "加载草稿列表失败",
          error
        ),
      });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [firebaseUser?.id]);

  /**
   * 确认删除草稿
   *
   * 执行删除操作，包括：
   * 1. 乐观更新本地状态
   * 2. 调用 API 删除草稿
   * 3. 清理本地存储
   * 4. 处理成功/失败状态
   *
   * @param e - 鼠标事件对象
   * @param articleId - 要删除的文章 ID
   */
  const handleConfirmDelete = async (
    e: React.MouseEvent,
    articleId: string
  ) => {
    e.stopPropagation();

    // 1. 立即更新本地状态
    dispatch({ type: "DELETE_OPTIMISTIC", payload: articleId });

    try {
      const articleCreator = new DefaultArticleCreator();
      await articleCreator.deleteDraft(articleId);

      const storage = new ArticleStorage();
      const stillExists = storage.getFromLocal(articleId);

      if (stillExists) {
        console.warn("草稿删除操作返回成功，但草稿仍存在于本地存储中");
        storage.removeFromLocal(articleId);
      }

      // 2. 删除成功，更新状态
      dispatch({ type: "DELETE_SUCCESS", payload: articleId });
    } catch (error) {
      console.error("删除草稿失败:", error);

      // 3. 删除失败，回滚状态
      dispatch({ type: "DELETE_ROLLBACK", payload: articleId });

      let errorType = DraftErrorType.UNKNOWN_ERROR;
      let errorMessage = "删除草稿失败，请重试";

      if (error instanceof Error) {
        if (error.message.includes("DELETE_ERROR")) {
          errorType = DraftErrorType.NETWORK_ERROR;
          errorMessage =
            "本地草稿已删除，但服务器同步失败。请刷新页面查看最新状态。";
        } else if (error.message.includes("PERMISSION_ERROR")) {
          errorType = DraftErrorType.PERMISSION_ERROR;
          errorMessage =
            "没有权限删除该文章。只有文章作者或管理员可以删除文章。";
        }
      }

      dispatch({
        type: "DELETE_ERROR",
        payload: createError(errorType, errorMessage, error),
      });
    }
  };

  /**
   * 取消删除操作
   *
   * @param e - 鼠标事件对象
   */
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "CANCEL_DELETE" });
  };

  /**
   * 清除错误状态
   */
  const handleClearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return {
    state,
    loadDrafts,
    handleConfirmDelete,
    handleCancelDelete,
    handleClearError,
    dispatch,
  };
}
