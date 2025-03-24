import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/modules/blog/types/blog";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { articles as staticArticlesData } from "@/data/articles";

// 定义Firestore Timestamp接口
interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

// 定义API返回的文章类型
interface ApiArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  imageSrc?: string; // 可能为空
  articleContent: {
    blocks: unknown[]; // 使用unknown代替any，因为我们不会直接操作blocks
    version: number;
    schema?: string;
    lastEditedBy?: string;
  };
  content: string;
  createdAt: string | FirestoreTimestamp; // API可能返回字符串或Timestamp
  updatedAt: string | FirestoreTimestamp;
  publishedAt?: string | FirestoreTimestamp;
  status: string;
  visibility: string;
  allowComments: boolean;
  tags: string[];
  category?: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    views: number;
    likes: number;
  };
  seoTitle?: string;
  seoDescription?: string;
}

// 定义API响应类型
interface ArticleApiResponse {
  articles: ApiArticle[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ListSectionProps {
  title: string;
  subtitle: string;
}

export function ListSection({ title, subtitle }: ListSectionProps) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [staticArticles, setStaticArticles] = useState<Article[]>([]);
  const [dbArticles, setDbArticles] = useState<ApiArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化静态文章
  useEffect(() => {
    setStaticArticles(staticArticlesData);
  }, []);

  // 安全转换日期值为Date对象
  const safeDate = (dateValue: unknown): Date | undefined => {
    // 处理Firestore Timestamp
    if (
      dateValue &&
      typeof dateValue === "object" &&
      "toDate" in dateValue &&
      typeof (dateValue as FirestoreTimestamp).toDate === "function"
    ) {
      return (dateValue as FirestoreTimestamp).toDate();
    }

    // 处理字符串日期
    if (typeof dateValue === "string") {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch {
        // 忽略无效日期字符串
      }
    }

    // 已经是Date对象
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }

    return undefined;
  };

  // 从数据库获取文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          "/api/articles?status=published&visibility=public"
        );

        if (!response.ok) {
          throw new Error(
            `获取文章失败: ${response.status} ${response.statusText}`
          );
        }

        const data = (await response.json()) as ArticleApiResponse;
        setDbArticles(data.articles || []);
      } catch (err) {
        console.error("获取文章失败:", err);
        setError("获取文章失败，显示静态文章");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 合并处理文章数据
  const mergedArticles = useMemo(() => {
    // 将API返回的文章转换为应用内的Article类型
    const validDbArticles = dbArticles.map((article: ApiArticle) => {
      // 确保每篇文章都有图片
      const imageSrc = article.imageSrc || "/images/default-article.jpg";

      // 安全转换日期
      const createdAt = safeDate(article.createdAt) || new Date();
      const updatedAt = safeDate(article.updatedAt) || createdAt;
      const publishedAt = article.publishedAt
        ? safeDate(article.publishedAt)
        : undefined;

      return {
        ...article,
        imageSrc,
        createdAt,
        updatedAt,
        publishedAt,
      } as Article;
    });

    // 合并文章并去重
    const articleIds = new Set();
    const result: Article[] = [];

    // 先添加静态文章
    staticArticles.forEach((article) => {
      if (!articleIds.has(article.id)) {
        articleIds.add(article.id);
        result.push(article);
      }
    });

    // 再添加数据库文章
    validDbArticles.forEach((article) => {
      if (!articleIds.has(article.id)) {
        articleIds.add(article.id);
        result.push(article);
      }
    });

    // 按日期排序（最新的排在前面）
    return result.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [staticArticles, dbArticles]);

  const handleCreateArticle = () => {
    router.push("/editor/new");
  };

  return (
    <section className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          {/* 只有当用户为管理员时才显示创建按钮 */}
          {user && isAdmin && (
            <motion.button
              className={styles.createButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateArticle}
            >
              创建文章
            </motion.button>
          )}
        </header>

        {isLoading ? (
          // 加载状态显示
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>正在加载文章...</p>
          </div>
        ) : (
          // 文章列表
          <div className={styles.grid}>
            {mergedArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ListItem article={article} />
              </motion.div>
            ))}
            {mergedArticles.length === 0 && (
              <p className={styles.noArticles}>暂无文章</p>
            )}
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
      </motion.div>
    </section>
  );
}
