import { BaseArticleOptions } from "@/modules/blog/types/creator";
import { BasicInfoFormData } from "@/modules/editor/components/BasicInfoForm";
import { ArticleVisibility } from "@/modules/blog/types/blog";

/**
 * 文章类型枚举
 * - blank: 空白文章
 * - template: 基于模板创建
 * - import: 导入外部文章
 * - draft: 从草稿继续编辑
 */
export type ArticleType = "blank" | "template" | "import" | "draft";

/**
 * 文章创建状态接口
 * 用于管理文章创建过程中的所有状态
 */
export interface ArticleCreationState {
  /** 当前选择的文章类型 */
  articleType: ArticleType | null;
  /** 表单数据，包含文章的基本信息和设置 */
  formData: Partial<BaseArticleOptions>;
  /** 是否显示基本信息表单 */
  showBasicInfo: boolean;
  /** 是否显示模板选择器 */
  showTemplate: boolean;
  /** 是否显示权限设置 */
  showPermission: boolean;
  /** 是否显示草稿列表 */
  showDrafts: boolean;
  /** 是否正在加载中 */
  isLoading: boolean;
  /** 错误信息，如果有的话 */
  error: string | null;
}

/**
 * 文章创建处理函数接口
 * 定义了所有处理文章创建过程中用户交互的函数
 */
export interface ArticleCreationHandlers {
  /** 处理文章类型选择变化 */
  handleArticleTypeChange: (type: ArticleType) => void;
  /** 处理基本信息表单提交 */
  handleBasicInfoSubmit: () => void;
  /** 处理模板选择 */
  handleTemplateSelect: (templateId: string) => void;
  /** 处理草稿选择 */
  handleDraftSelect: (articleId: string) => void;
  /** 处理文章创建提交 */
  handleSubmit: () => Promise<void>;
  /** 处理权限设置变化，同时也可以处理基本信息的更新 */
  handlePermissionChange: (
    data: Partial<BasicInfoFormData> & {
      visibility?: ArticleVisibility;
      allowComments?: boolean;
    }
  ) => void;
}

/**
 * 文章创建 Hook 选项接口
 * 用于配置文章创建过程中的回调函数
 */
export interface UseArticleCreationOptions {
  /** 文章创建成功时的回调 */
  onSuccess?: (articleId: string) => void;
  /** 文章创建失败时的回调 */
  onError?: (error: Error) => void;
}
