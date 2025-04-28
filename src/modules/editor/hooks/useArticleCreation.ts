import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ArticleCreationService } from "@/modules/editor/services/articleCreationService";
import {
  ArticleType,
  ArticleCreationState,
  ArticleCreationHandlers,
  UseArticleCreationOptions,
} from "./types/articleCreation.types";
import { ArticleVisibility } from "@/modules/blog/types/blog";
import { BasicInfoFormData } from "@/modules/editor/components/BasicInfoForm";

/**
 * 文章创建的自定义 Hook
 * 管理文章创建过程中的状态和操作，包括：
 * - 文章类型选择
 * - 基本信息填写
 * - 模板选择
 * - 草稿选择
 * - 权限设置
 *
 * @param options 配置选项，包含成功和失败的回调函数
 * @returns 包含状态和处理函数的对象
 */
export function useArticleCreation(options: UseArticleCreationOptions = {}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const articleCreationService = new ArticleCreationService();

  // 状态管理
  const [state, setState] = useState<ArticleCreationState>({
    articleType: null,
    formData: {
      visibility: "private" as ArticleVisibility,
      allowComments: true,
    },
    showBasicInfo: false,
    showTemplate: false,
    showPermission: false,
    showDrafts: false,
    isLoading: false,
    error: null,
  });

  const handlers: ArticleCreationHandlers = {
    handleArticleTypeChange: (type: ArticleType) => {
      setState((prev) => ({
        ...prev,
        articleType: type,
        showBasicInfo: type !== "draft",
        showDrafts: type === "draft",
      }));

      if (type === "draft") {
        // 滚动到草稿选择
        setTimeout(() => {
          document.getElementById("draft-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        // 滚动到基本信息表单
        setTimeout(() => {
          document.getElementById("basic-info-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },

    handleBasicInfoSubmit: () => {
      if (state.articleType === "template") {
        setState((prev) => ({
          ...prev,
          showTemplate: true,
        }));
        setTimeout(() => {
          document.getElementById("template-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        setState((prev) => ({
          ...prev,
          showPermission: true,
        }));
        setTimeout(() => {
          document.getElementById("permission-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },

    handleTemplateSelect: (templateId: string) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, templateId },
        showPermission: true,
      }));
      setTimeout(() => {
        document.getElementById("permission-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },

    handleDraftSelect: (articleId: string) => {
      router.push(`/editor/${articleId}`);
    },

    handlePermissionChange: (
      data: Partial<BasicInfoFormData> & {
        visibility?: ArticleVisibility;
        allowComments?: boolean;
      }
    ) => {
      setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          ...data,
          visibility: data.visibility || prev.formData.visibility,
          allowComments: data.allowComments ?? prev.formData.allowComments,
        },
      }));
    },

    handleSubmit: async () => {
      if (!isAuthenticated || !user) {
        setState((prev) => ({ ...prev, error: "请先登录" }));
        return;
      }

      if (!state.articleType) {
        setState((prev) => ({ ...prev, error: "请选择文章类型" }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const baseOptions = {
          ...state.formData,
          visibility:
            state.formData.visibility || ("private" as ArticleVisibility),
          allowComments: state.formData.allowComments ?? true,
          tags: [],
        };

        let article;
        switch (state.articleType) {
          case "template":
            if (!state.formData.templateId) {
              throw new Error("请选择模板");
            }
            article = await articleCreationService.createFromTemplate({
              ...baseOptions,
              templateId: state.formData.templateId,
            });
            break;

          case "import":
            article = await articleCreationService.createFromImport({
              ...baseOptions,
              importData: {
                source: "external",
                content: null,
              },
            });
            break;

          case "draft":
            throw new Error("请选择一个草稿文章继续编辑");

          default:
            article = await articleCreationService.createBlankArticle(
              baseOptions
            );
        }

        options.onSuccess?.(article.id);
        router.push(`/editor/${article.id}`);
      } catch (err) {
        console.error("创建文章失败:", err);
        const error =
          err instanceof Error ? err.message : "创建文章失败，请重试";
        setState((prev) => ({ ...prev, error }));
        options.onError?.(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
  };

  return {
    state,
    handlers,
  };
}
