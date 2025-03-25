import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { ArticleHeader } from "@/modules/blog/components/ArticleHeader";
import { ArticleContent } from "@/modules/blog/components/ArticleContent";
import {
  getAllArticleIds,
  getArticleFromStatic,
  normalizeArticle,
} from "@/modules/blog/services/articleService";
import { articles as staticArticles } from "@/data/articles";
import { Article } from "@/modules/blog/types/blog";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 获取站点基础URL辅助函数
function getBaseUrl() {
  // 优先使用环境变量中的URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Vercel部署环境
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 开发环境默认
  return "http://localhost:3000";
}

export default async function BlogPostPage({
  params,
  searchParams,
}: BlogPostPageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const { id } = resolvedParams;

  // 首先尝试从静态数据获取文章
  const staticArticle = getArticleFromStatic(id);

  // 如果没有找到静态文章，则尝试获取数据库文章
  if (!staticArticle) {
    try {
      // 构建绝对URL
      const baseUrl = getBaseUrl();
      const apiUrl = `${baseUrl}/api/articles/${id}`;
      console.log(`尝试从API获取文章: ${apiUrl}`);

      // 通过API端点从数据库获取
      const res = await fetch(apiUrl, {
        cache: "no-store",
        // 确保始终解析为当前主机的API
        next: {
          revalidate: 0,
        },
      });

      if (res.ok) {
        const dbArticle = await res.json();
        if (dbArticle) {
          return renderArticle(normalizeArticle(dbArticle));
        }
      } else {
        console.error(`API响应错误: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error("获取数据库文章失败:", error);
    }
  } else {
    // 找到静态文章，直接渲染
    return renderArticle(staticArticle);
  }

  // 如果两种方式都没有找到文章，则返回404
  notFound();
}

// 渲染文章组件
function renderArticle(article: Article) {
  return (
    <article className={styles.article}>
      <ArticleHeader
        title={article.title}
        author={article.author}
        createdAt={article.createdAt}
        tags={article.tags}
        coverImage={article.imageSrc}
      />
      <ArticleContent
        blocks={article.articleContent.blocks}
        version={article.articleContent.version}
        schema={article.articleContent.schema || ""}
      />
    </article>
  );
}

export async function generateStaticParams() {
  // 获取静态文章的参数
  const staticParams = staticArticles.map((article) => ({
    id: String(article.id),
  }));

  // 获取数据库中的文章ID
  try {
    const dbIds = await getAllArticleIds();
    const dbParams = dbIds.map((id: string) => ({ id }));

    // 合并两种来源的参数，并去重
    const allIds = new Set([
      ...staticParams.map((param: { id: string }) => param.id),
      ...dbParams.map((param: { id: string }) => param.id),
    ]);

    return Array.from(allIds).map((id: string) => ({ id }));
  } catch (error) {
    console.error("获取数据库文章参数失败:", error);
    // 如果获取数据库参数失败，至少返回静态参数
    return staticParams;
  }
}
