"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useArticleCreation } from "@/modules/editor/hooks/useArticleCreation";
import { ArticleTypeSelector } from "@/modules/editor/components/ArticleTypeSelector";
import {
  BasicInfoForm,
  BasicInfoFormData,
} from "@/modules/editor/components/BasicInfoForm";
import { TemplateSelector } from "@/modules/editor/components/TemplateSelector";
import { DraftSelector } from "@/modules/editor/components/DraftSelector";
import {
  PermissionSettings,
  Visibility,
} from "@/modules/editor/components/PermissionSettings";
import styles from "./styles.module.css";

/**
 * 新建文章页面组件
 * 提供完整的文章创建流程，包括：
 * - 选择文章类型（空白/模板/导入）
 * - 设置基本信息
 * - 选择模板（如果适用）
 * - 设置权限
 */
export default function NewArticlePage() {
  const router = useRouter();

  // 使用 useArticleCreation Hook
  const { state, handlers } = useArticleCreation({
    onSuccess: (articleId) => {
      router.push(`/editor/${articleId}`);
    },
    onError: (error) => {
      console.error("创建文章失败:", error);
    },
  });

  // 引用各个部分的 DOM 元素
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);
  const permissionRef = useRef<HTMLDivElement>(null);

  if (state.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>创建文章中，请稍候...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.createArticleForm}>
        <section className={styles.formSection}>
          <ArticleTypeSelector
            value={state.articleType}
            onChange={handlers.handleArticleTypeChange}
          />
        </section>

        {state.showDrafts && state.articleType === "draft" && (
          <section
            className={styles.formSection}
            ref={draftRef}
            id="draft-section"
          >
            <DraftSelector onSelect={handlers.handleDraftSelect} />
          </section>
        )}

        {state.showBasicInfo && (
          <section
            className={styles.formSection}
            ref={basicInfoRef}
            id="basic-info-section"
          >
            <BasicInfoForm
              value={{
                title: state.formData.title,
                description: state.formData.description,
                category: state.formData.category,
              }}
              onChange={(data: BasicInfoFormData) => {
                // 只更新基本信息，不包含权限设置
                handlers.handlePermissionChange({
                  ...state.formData,
                  ...data,
                });
              }}
              onSubmit={handlers.handleBasicInfoSubmit}
            />
          </section>
        )}

        {state.showTemplate && state.articleType === "template" && (
          <section
            className={styles.formSection}
            ref={templateRef}
            id="template-section"
          >
            <TemplateSelector onSelect={handlers.handleTemplateSelect} />
          </section>
        )}

        {state.showPermission && (
          <section
            className={styles.formSection}
            ref={permissionRef}
            id="permission-section"
          >
            <PermissionSettings
              visibility={state.formData.visibility as Visibility}
              allowComments={state.formData.allowComments ?? true}
              onChange={handlers.handlePermissionChange}
            />
          </section>
        )}

        {state.error && (
          <div className={styles.error}>
            <p>{state.error}</p>
          </div>
        )}

        {state.showPermission && (
          <button
            className={styles.createButton}
            onClick={handlers.handleSubmit}
            disabled={state.isLoading}
          >
            创建文章
          </button>
        )}
      </div>
    </div>
  );
}
