"use client";

import { memo } from "react";
import { BiFile, BiBookContent, BiImport, BiNotepad } from "react-icons/bi";
import styles from "./styles.module.css";

export type ArticleType = "blank" | "template" | "import" | "draft";

interface ArticleTypeOption {
  type: ArticleType;
  label: string;
  description: string;
  icon: typeof BiFile;
}

interface ArticleTypeSelectorProps {
  value: ArticleType | null;
  onChange: (type: ArticleType) => void;
}

const articleTypes: ArticleTypeOption[] = [
  {
    type: "blank",
    label: "空白文章",
    description: "从零开始创作你的文章",
    icon: BiFile,
  },
  {
    type: "template",
    label: "使用模板",
    description: "从预设模板中选择创建",
    icon: BiBookContent,
  },
  {
    type: "import",
    label: "导入文章",
    description: "从其他平台导入文章",
    icon: BiImport,
  },
  {
    type: "draft",
    label: "继续编辑",
    description: "读取之前未发布的草稿文章",
    icon: BiNotepad,
  },
];

export const ArticleTypeSelector = memo(function ArticleTypeSelector({
  value,
  onChange,
}: ArticleTypeSelectorProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>选择创建方式</h2>
      <div className={styles.optionsGrid}>
        {articleTypes.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.type;

          return (
            <button
              key={option.type}
              className={`${styles.optionCard} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => onChange(option.type)}
              aria-selected={isSelected}
              role="option"
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.optionTitle}>{option.label}</h3>
                <p className={styles.description}>{option.description}</p>
              </div>
              <div className={styles.selectedIndicator} />
            </button>
          );
        })}
      </div>
    </div>
  );
});
