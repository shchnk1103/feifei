import { notFound } from "next/navigation";
import { EditorClientPage } from "@/modules/editor/components/EditorClientPage";
import { getArticleFromStatic } from "@/modules/blog/services/articleService";
import { DEFAULT_ARTICLE } from "@/modules/blog/types/blog";
import { Suspense } from "react";
import styles from "./page.module.css";
import { Article } from "@/modules/blog/types/blog";

/**
 * 编辑器页面组件
 * @param {Object} props - 页面属性
 * @param {Object} props.params - URL参数
 * @param {string} props.params.id - 文章ID
 */
export default function Page(props) {
  const { id } = props.params;

  // 创建一个默认文章结构，适用于新建文章（如draft-开头的id）
  const createDefaultArticle = () => {
    return {
      ...DEFAULT_ARTICLE,
      id,
      title: "未命名文章",
      blocks: [
        {
          id: `block-${Date.now()}`,
          type: "heading",
          content: "开始写作吧",
          level: 1,
        },
        {
          id: `block-${Date.now() + 1}`,
          type: "text",
          content: "这是您新文章的开始。点击任何地方开始编辑...",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
    } as Article;
  };

  // 尝试获取文章数据
  let article: Article | null = null;

  // 如果是新建的草稿文章（以draft-开头）
  if (id.startsWith("draft-")) {
    article = createDefaultArticle();
  } else {
    // 首先尝试从静态数据获取
    const staticArticle = getArticleFromStatic(id);

    if (staticArticle) {
      article = staticArticle;
    } else {
      // 如果仍然找不到文章，返回404
      notFound();
    }
  }

  return (
    <Suspense
      fallback={<div className={styles.loading}>正在加载编辑器...</div>}
    >
      <EditorClientPage initialArticle={article as Article} />
    </Suspense>
  );
}
