import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/modules/blog/types/blog";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { articles as staticArticlesData } from "@/data/articles";
import {
  DBArticle,
  mergeArticles,
} from "@/modules/blog/services/articleService";

// 导入响应类型，但使用另一个名称避免冲突
import type { ArticleApiResponse as ApiResponse } from "@/modules/blog/services/articleService";

interface ListSectionProps {
  title: string;
  subtitle: string;
}

export function ListSection({ title, subtitle }: ListSectionProps) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [staticArticles, setStaticArticles] = useState<Article[]>([]);
  const [dbArticles, setDbArticles] = useState<DBArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化静态文章
  useEffect(() => {
    setStaticArticles(staticArticlesData);
  }, []);

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

        const data = (await response.json()) as ApiResponse;
        // 确保数据转换为正确的类型
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

  // 合并处理文章数据，使用共享服务
  const mergedArticles = useMemo(() => {
    return mergeArticles(staticArticles, dbArticles);
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
