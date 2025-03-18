"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  BaseArticleOptions,
  ImportArticleOptions,
} from "@/modules/blog/types/creator";
import { DefaultArticleCreator } from "@/modules/blog/services/articleCreator";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ArticleTypeSelector } from "@/modules/editor/components/ArticleTypeSelector";
import {
  BasicInfoForm,
  BasicInfoFormData,
} from "@/modules/editor/components/BasicInfoForm";
import { TemplateSelector } from "@/modules/editor/components/TemplateSelector";
import {
  PermissionSettings,
  Visibility,
} from "@/modules/editor/components/PermissionSettings";
import styles from "./styles.module.css";

type ArticleType = "blank" | "template" | "import";

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
  const { user, isAuthenticated } = useAuth();
  const articleCreator = new DefaultArticleCreator();

  // 状态管理
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [articleType, setArticleType] = useState<ArticleType | null>(null);
  const [formData, setFormData] = useState<Partial<BaseArticleOptions>>({
    visibility: "private",
    allowComments: true,
  });
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showPermission, setShowPermission] = useState(false);

  // 引用各个部分的 DOM 元素
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const permissionRef = useRef<HTMLDivElement>(null);

  // 处理文章类型选择
  const handleArticleTypeChange = (type: ArticleType) => {
    setArticleType(type);
    setShowBasicInfo(true);
    // 滚动到基本信息表单
    setTimeout(() => {
      basicInfoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // 处理基本信息表单提交
  const handleBasicInfoSubmit = () => {
    if (articleType === "template") {
      // 如果是模板类型，显示并滚动到模板选择器
      setShowTemplate(true);
      setTimeout(() => {
        templateRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      // 否则显示并滚动到权限设置
      setShowPermission(true);
      setTimeout(() => {
        permissionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  // 处理模板选择
  const handleTemplateSelect = (templateId: string) => {
    setFormData({ ...formData, templateId });
    // 显示并滚动到权限设置
    setShowPermission(true);
    setTimeout(() => {
      permissionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      setError("请先登录");
      return;
    }

    if (!articleType) {
      setError("请选择文章类型");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseOptions: BaseArticleOptions = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        visibility: formData.visibility || "private",
        allowComments: formData.allowComments ?? true,
        tags: [],
      };

      let article;
      switch (articleType) {
        case "template":
          if (!formData.templateId) {
            throw new Error("请选择模板");
          }
          article = await articleCreator.createFromTemplate({
            ...baseOptions,
            templateId: formData.templateId,
          });
          break;

        case "import":
          const importOptions: ImportArticleOptions = {
            ...baseOptions,
            importData: {
              source: "external",
              content: null,
            },
          };
          article = await articleCreator.createFromImport(importOptions);
          break;

        default:
          article = await articleCreator.createBlankArticle(baseOptions);
      }

      router.push(`/editor/${article.id}`);
    } catch (err) {
      console.error("创建文章失败:", err);
      setError(err instanceof Error ? err.message : "创建文章失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
            value={articleType}
            onChange={handleArticleTypeChange}
          />
        </section>

        {showBasicInfo && (
          <section className={styles.formSection} ref={basicInfoRef}>
            <BasicInfoForm
              value={formData}
              onChange={(data: BasicInfoFormData) =>
                setFormData({ ...formData, ...data })
              }
              onSubmit={handleBasicInfoSubmit}
            />
          </section>
        )}

        {showTemplate && articleType === "template" && (
          <section className={styles.formSection} ref={templateRef}>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </section>
        )}

        {showPermission && (
          <section className={styles.formSection} ref={permissionRef}>
            <PermissionSettings
              visibility={formData.visibility || "private"}
              allowComments={formData.allowComments ?? true}
              onChange={(settings: {
                visibility: Visibility;
                allowComments: boolean;
              }) => setFormData({ ...formData, ...settings })}
            />
          </section>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {showPermission && (
          <button
            className={styles.createButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            创建文章
          </button>
        )}
      </div>
    </div>
  );
}
