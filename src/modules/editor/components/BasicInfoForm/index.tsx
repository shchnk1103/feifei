"use client";

import { memo, useMemo, useState } from "react";
import { BiPencil } from "react-icons/bi";
import styles from "./styles.module.css";

export interface BasicInfoFormData {
  title?: string;
  description?: string;
  category?: string;
}

interface BasicInfoFormProps {
  value: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
  onSubmit: () => void;
}

export const BasicInfoForm = memo(function BasicInfoForm({
  value,
  onChange,
  onSubmit,
}: BasicInfoFormProps) {
  // 跟踪字段是否被触碰过
  const [touched, setTouched] = useState({
    title: false,
    category: false,
  });

  const handleChange = (field: keyof BasicInfoFormData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });

    // 标记字段为已触碰
    if (!touched[field as keyof typeof touched]) {
      setTouched({
        ...touched,
        [field]: true,
      });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    if (!touched[field]) {
      setTouched({
        ...touched,
        [field]: true,
      });
    }
  };

  // 检查表单是否有效
  const isValid = useMemo(() => {
    return Boolean(value.title?.trim() && value.category);
  }, [value.title, value.category]);

  // 字段是否有错误（仅在触碰后检查）
  const hasError = {
    title: touched.title && !value.title?.trim(),
    category: touched.category && !value.category,
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>基本信息</h3>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            <BiPencil className={styles.icon} />
            文章标题
            <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            className={`${styles.input} ${
              hasError.title ? styles.inputError : ""
            }`}
            value={value.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            placeholder="请输入文章标题"
            maxLength={100}
          />
          <div className={styles.hint}>
            标题长度：{(value.title || "").length}/100
            {hasError.title && (
              <span className={styles.errorText}>请输入文章标题</span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            <BiPencil className={styles.icon} />
            文章描述
          </label>
          <textarea
            id="description"
            className={`${styles.input} ${styles.textarea}`}
            value={value.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="请输入文章描述（选填）"
            maxLength={200}
            rows={3}
          />
          <div className={styles.hint}>
            描述长度：{(value.description || "").length}/200
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            <BiPencil className={styles.icon} />
            文章分类
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="category"
              className={`${styles.select} ${
                hasError.category ? styles.selectError : ""
              }`}
              value={value.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
            >
              <option value="">请选择分类</option>
              <option value="tech">技术</option>
              <option value="life">生活</option>
              <option value="thoughts">随想</option>
              <option value="other">其他</option>
            </select>
            <div className={styles.selectArrow} />
          </div>
          {hasError.category && (
            <div className={styles.errorText}>请选择文章分类</div>
          )}
        </div>

        <button
          className={`${styles.nextButton} ${
            !isValid ? styles.nextButtonDisabled : ""
          }`}
          onClick={onSubmit}
          disabled={!isValid}
        >
          下一步
        </button>
      </div>
    </div>
  );
});
