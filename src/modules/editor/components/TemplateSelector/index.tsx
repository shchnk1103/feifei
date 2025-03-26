"use client";

import { memo, useEffect, useState } from "react";
import { BiSearch, BiLoader } from "react-icons/bi";
import styles from "./styles.module.css";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

// 模拟模板数据
const MOCK_TEMPLATES: Template[] = [
  {
    id: "template-1",
    name: "技术博客模板",
    description: "适合编写技术文章的结构化模板",
    thumbnail: "https://source.unsplash.com/random/300x200/?technology",
    category: "tech",
  },
  {
    id: "template-2",
    name: "读书笔记模板",
    description: "记录读书心得和重点摘抄的模板",
    thumbnail: "https://source.unsplash.com/random/300x200/?books",
    category: "reading",
  },
  {
    id: "template-3",
    name: "周报模板",
    description: "总结一周工作和生活的模板",
    thumbnail: "https://source.unsplash.com/random/300x200/?work",
    category: "work",
  },
];

export const TemplateSelector = memo(function TemplateSelector({
  onSelect,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 模拟加载模板数据
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // 这里应该是实际的 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTemplates(MOCK_TEMPLATES);
      } catch (error) {
        console.error("加载模板失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <BiLoader className={styles.spinner} />
        <p>加载模板中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>选择模板</h3>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <BiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">所有分类</option>
          <option value="tech">技术</option>
          <option value="reading">读书笔记</option>
          <option value="work">工作</option>
        </select>
      </div>

      <div className={styles.templateGrid}>
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            className={styles.templateCard}
            onClick={() => onSelect(template.id)}
          >
            <OptimizedImage
              src={template.thumbnail}
              alt={template.name}
              width={300}
              height={200}
              className={styles.thumbnail}
            />
            <div className={styles.templateInfo}>
              <h4 className={styles.templateName}>{template.name}</h4>
              <p className={styles.templateDescription}>
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className={styles.noResults}>
          <p>没有找到匹配的模板</p>
        </div>
      )}
    </div>
  );
});
